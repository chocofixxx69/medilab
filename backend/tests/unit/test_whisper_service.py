"""Unit tests for Open-Source Whisper Speech-to-Text service and device detection."""

import pytest
from app.services.speech_to_text import (
    LANGUAGE_CODES,
    WHISPER_LANGUAGE_MAPPING,
    TranscriptResult,
    OpenSourceWhisperService,
    UnifiedSpeechToTextService,
    detect_device_and_compute_type,
    get_stt_service,
)


class TestDeviceDetection:
    """Test device and quantization detection for laptops and workstations."""

    def test_detect_device_returns_valid_tuple(self):
        device, compute_type = detect_device_and_compute_type()
        assert device in ("cpu", "cuda")
        assert compute_type in ("int8", "float16", "int8_float32", "int8_float16", "default")

    def test_default_laptop_cpu_fallback(self):
        """On machines without CUDA, device should be cpu and compute_type int8."""
        device, compute_type = detect_device_and_compute_type()
        if device == "cpu":
            assert compute_type in ("int8", "int8_float32")


class TestWhisperLanguageMapping:
    """Test language mappings for Indian Indic languages in Whisper."""

    def test_indic_languages_present(self):
        indic_keys = ["en", "hi", "ta", "te", "ml", "kn", "bn", "mr", "gu", "pa"]
        for key in indic_keys:
            assert key in LANGUAGE_CODES
            assert key in WHISPER_LANGUAGE_MAPPING.values()

    def test_locale_to_whisper_code(self):
        assert WHISPER_LANGUAGE_MAPPING["hi-IN"] == "hi"
        assert WHISPER_LANGUAGE_MAPPING["ta-IN"] == "ta"
        assert WHISPER_LANGUAGE_MAPPING["en-IN"] == "en"


class TestTranscriptResult:
    """Test TranscriptResult data structure."""

    def test_transcript_result_serialization(self):
        res = TranscriptResult(
            text="Patient has mild headache and fever.",
            is_final=True,
            confidence=0.98,
            language="hi",
            segments=[
                {"start": 0.0, "end": 2.5, "text": "Patient has mild headache"},
                {"start": 2.5, "end": 4.8, "text": "and fever."},
            ],
            duration_seconds=4.8,
            engine="faster-whisper (open-source)",
            device="cpu [int8]",
        )

        d = res.to_dict()
        assert d["text"] == "Patient has mild headache and fever."
        assert d["confidence"] == 0.98
        assert d["language"] == "hi"
        assert len(d["segments"]) == 2
        assert d["engine"].startswith("faster-whisper")
        assert "cpu" in d["device"]


class TestOpenSourceWhisperService:
    """Test OpenSourceWhisperService instantiation and interfaces."""

    def test_whisper_service_initialization(self):
        service = OpenSourceWhisperService(language="hi", model_size="base")
        assert service.language == "hi"
        assert service.model_size == "base"
        assert service.device in ("cpu", "cuda")

    @pytest.mark.asyncio
    async def test_empty_audio_returns_empty_result(self):
        service = OpenSourceWhisperService(language="en")
        result = await service.transcribe_audio(b"")
        assert result.text == ""
        assert result.is_final is True


class TestUnifiedSTTFallbackChain:
    """Test multi-engine fallback to guarantee zero failures."""

    def test_get_stt_service_returns_unified(self):
        service = get_stt_service("en")
        assert isinstance(service, UnifiedSpeechToTextService)
        assert service.language == "en"

    @pytest.mark.asyncio
    async def test_unified_service_transcribe_fallback(self):
        service = get_stt_service("en")
        # Transcribe empty or dummy audio - should resolve gracefully without unhandled exception
        result = await service.transcribe_audio(b"")
        assert result is not None
        assert isinstance(result.text, str)
