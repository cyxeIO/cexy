'use client';

import { useState, useRef, useCallback } from 'react';
import { Play, Pause, Square, Mic, Video } from 'lucide-react';
import toast from 'react-hot-toast';

interface RecordingControlsProps {
  onRecordingComplete: (blob: Blob, type: 'audio' | 'video') => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

export default function RecordingControls({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
}: RecordingControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video'>('audio');
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const constraints = {
        audio: true,
        video: recordingType === 'video',
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: recordingType === 'video' 
          ? 'video/webm;codecs=vp9' 
          : 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recordingType === 'video' ? 'video/webm' : 'audio/webm',
        });
        onRecordingComplete(blob, recordingType);
        
        // Clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setDuration(0);
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      onRecordingStart?.();
      toast.success(`${recordingType === 'video' ? 'Video' : 'Audio'} recording started`);
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to start recording. Please check your permissions.');
    }
  }, [recordingType, onRecordingComplete, onRecordingStart]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        intervalRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
        setIsPaused(false);
        toast.success('Recording resumed');
      } else {
        mediaRecorderRef.current.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsPaused(true);
        toast.success('Recording paused');
      }
    }
  }, [isRecording, isPaused]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      onRecordingStop?.();
      toast.success('Recording stopped');
    }
  }, [isRecording, onRecordingStop]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecordingType = () => {
    if (!isRecording) {
      setRecordingType(prev => prev === 'audio' ? 'video' : 'audio');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Memory Recording
        </h3>
        <div className="text-2xl font-mono text-blue-600 mb-4">
          {formatDuration(duration)}
        </div>
        
        {/* Recording Type Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={toggleRecordingType}
              disabled={isRecording}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                recordingType === 'audio'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500'
              } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Mic size={16} />
              Audio
            </button>
            <button
              onClick={toggleRecordingType}
              disabled={isRecording}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                recordingType === 'video'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500'
              } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Video size={16} />
              Video
            </button>
          </div>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-colors shadow-lg"
          >
            {recordingType === 'video' ? <Video size={24} /> : <Mic size={24} />}
          </button>
        ) : (
          <>
            <button
              onClick={pauseRecording}
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-4 transition-colors shadow-lg"
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
            <button
              onClick={stopRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-full p-4 transition-colors shadow-lg"
            >
              <Square size={24} />
            </button>
          </>
        )}
      </div>

      {/* Status Indicator */}
      {isRecording && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              isPaused ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600">
              {isPaused ? 'Paused' : 'Recording...'}
            </span>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>Click the red button to start recording.</p>
        <p>Switch between audio and video modes using the toggle above.</p>
      </div>
    </div>
  );
}
