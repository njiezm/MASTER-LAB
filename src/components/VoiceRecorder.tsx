'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Play, Pause, Square, Download, Trash2 } from 'lucide-react'

interface VoiceRecording {
  id: string
  title: string
  blob: Blob
  url: string
  duration: number
  timestamp: Date
  transcript?: string
}

export function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordings, setRecordings] = useState<VoiceRecording[]>([])
  const [currentRecording, setCurrentRecording] = useState<VoiceRecording | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Charger les enregistrements depuis le localStorage
    const savedRecordings = localStorage.getItem('voice-recordings')
    if (savedRecordings) {
      const parsed = JSON.parse(savedRecordings)
      setRecordings(parsed.map((r: any) => ({
        ...r,
        timestamp: new Date(r.timestamp),
        blob: new Blob([], { type: r.blobType })
      })))
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Sauvegarder les enregistrements dans le localStorage
    if (recordings.length > 0) {
      const recordingsToSave = recordings.map(r => ({
        ...r,
        blobType: r.blob.type,
        timestamp: r.timestamp.toISOString()
      }))
      localStorage.setItem('voice-recordings', JSON.stringify(recordingsToSave))
    }
  }, [recordings])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Configuration de l'analyseur audio pour le niveau sonore
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.fftSize = 256
      analyserRef.current = analyser

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        const recording: VoiceRecording = {
          id: Date.now().toString(),
          title: `Enregistrement ${new Date().toLocaleString()}`,
          blob: audioBlob,
          url: audioUrl,
          duration: recordingTime,
          timestamp: new Date()
        }

        setRecordings([...recordings, recording])
        setCurrentRecording(recording)
        setRecordingTime(0)
        setAudioLevel(0)
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Démarrer le timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      // Démarrer l'animation du niveau audio
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel(average / 255)
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
      }
      updateAudioLevel()

    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error)
      alert('Impossible d\'accéder au microphone. Veuillez vérifier les permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
  }

  const playRecording = (recording: VoiceRecording) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(recording.url)
    audioRef.current = audio
    
    audio.addEventListener('timeupdate', () => {
      setPlaybackTime(audio.currentTime)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setPlaybackTime(0)
    })

    audio.play()
    setIsPlaying(true)
    setCurrentRecording(recording)
  }

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const deleteRecording = (id: string) => {
    setRecordings(recordings.filter(r => r.id !== id))
    if (currentRecording?.id === id) {
      setCurrentRecording(null)
      setIsPlaying(false)
      setPlaybackTime(0)
    }
  }

  const downloadRecording = (recording: VoiceRecording) => {
    const a = document.createElement('a')
    a.href = recording.url
    a.download = `${recording.title}.wav`
    a.click()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Contrôles d'enregistrement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Enregistrement Vocal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Niveau audio */}
          {isRecording && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Niveau audio</span>
                <span>{Math.round(audioLevel * 100)}%</span>
              </div>
              <Progress value={audioLevel * 100} className="h-2" />
            </div>
          )}

          {/* Timer d'enregistrement */}
          {isRecording && (
            <div className="text-center">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {formatTime(recordingTime)}
              </Badge>
              {isPaused && <p className="text-sm text-muted-foreground mt-2">En pause</p>}
            </div>
          )}

          {/* Boutons de contrôle */}
          <div className="flex justify-center gap-2">
            {!isRecording ? (
              <Button onClick={startRecording} size="lg" className="bg-red-500 hover:bg-red-600">
                <Mic className="h-5 w-5 mr-2" />
                Commencer l'enregistrement
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button onClick={pauseRecording} variant="outline" size="lg">
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button onClick={resumeRecording} variant="outline" size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    Reprendre
                  </Button>
                )}
                <Button onClick={stopRecording} variant="destructive" size="lg">
                  <Square className="h-5 w-5 mr-2" />
                  Arrêter
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lecteur audio pour l'enregistrement courant */}
      {currentRecording && (
        <Card>
          <CardHeader>
            <CardTitle>Lecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{currentRecording.title}</span>
              <Badge variant="outline">{formatTime(currentRecording.duration)}</Badge>
            </div>
            
            <div className="space-y-2">
              <Progress 
                value={(playbackTime / currentRecording.duration) * 100} 
                className="h-2" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(Math.floor(playbackTime))}</span>
                <span>{formatTime(currentRecording.duration)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {!isPlaying ? (
                <Button onClick={() => playRecording(currentRecording)} variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Lire
                </Button>
              ) : (
                <Button onClick={pausePlayback} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={() => downloadRecording(currentRecording)} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des enregistrements */}
      {recordings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mes Enregistrements ({recordings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recordings.map((recording) => (
                <div key={recording.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{recording.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {recording.timestamp.toLocaleString()} • {formatTime(recording.duration)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => playRecording(recording)}
                      variant="outline"
                      size="sm"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => downloadRecording(recording)}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => deleteRecording(recording.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}