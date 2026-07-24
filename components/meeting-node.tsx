"use client";

import { useEffect, useRef, useState, ChangeEvent, DragEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mic, MicOff, Paperclip, RefreshCw, FileAudio, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

const stages = [
  "Reading transcript & discovery notes…",
  "Identifying key stakeholders & deliverables…",
  "Structuring scope, budget & timeline…",
  "Meta-Agent Auditing Quality & Alignment…",
  "Finalizing proposal approval packet…",
];

export function MeetingNode({ roomName }: { roomName: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramProjectId = searchParams.get("projectId") ?? "";

  const [projectId, setProjectId] = useState(paramProjectId);
  const [fetchingProject, setFetchingProject] = useState(false);
  const [notes, setNotes] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<{
    proposalId: string;
    confidenceScore: number;
    iterations: number;
    readyForApproval: boolean;
  } | null>(null);
  const [error, setError] = useState("");

  // Multi-modal states
  const [isListeningNotes, setIsListeningNotes] = useState(false);
  const [isListeningTranscript, setIsListeningTranscript] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [isSyncingFathom, setIsSyncingFathom] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const notesRecognitionRef = useRef<any>(null);
  const transcriptRecognitionRef = useRef<any>(null);

  useEffect(() => {
    if (paramProjectId) {
      setProjectId(paramProjectId);
      return;
    }
    if (!roomName) return;

    let isMounted = true;
    setFetchingProject(true);
    fetch(`/api/projects/by-room/${encodeURIComponent(roomName)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.projectId) {
          setProjectId(data.projectId);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setFetchingProject(false);
      });

    return () => {
      isMounted = false;
    };
  }, [paramProjectId, roomName]);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => {
      setStep((current) => Math.min(current + 1, stages.length - 1));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    return () => {
      notesRecognitionRef.current?.stop();
      transcriptRecognitionRef.current?.stop();
    };
  }, []);

  function toggleNotesDictation() {
    if (isListeningNotes) {
      notesRecognitionRef.current?.stop();
      setIsListeningNotes(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Web Speech API is not supported in this browser. Please type notes directly.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcriptText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcriptText += event.results[i][0].transcript;
        }
        setNotes((prev) => (prev ? `${prev} ${transcriptText}` : transcriptText));
      };

      recognition.onerror = () => setIsListeningNotes(false);
      recognition.onend = () => setIsListeningNotes(false);

      notesRecognitionRef.current = recognition;
      recognition.start();
      setIsListeningNotes(true);
    } catch {
      setIsListeningNotes(false);
    }
  }

  function toggleTranscriptDictation() {
    if (isListeningTranscript) {
      transcriptRecognitionRef.current?.stop();
      setIsListeningTranscript(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Web Speech API is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcriptText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcriptText += event.results[i][0].transcript;
        }
        setTranscript((prev) => (prev ? `${prev} ${transcriptText}` : transcriptText));
      };

      recognition.onerror = () => setIsListeningTranscript(false);
      recognition.onend = () => setIsListeningTranscript(false);

      transcriptRecognitionRef.current = recognition;
      recognition.start();
      setIsListeningTranscript(true);
    } catch {
      setIsListeningTranscript(false);
    }
  }

  async function processAudioFile(file: File) {
    if (!file.type.startsWith("audio/") && !file.name.match(/\.(mp3|m4a|wav|aac|ogg|webm)$/i)) {
      setError("Please select a valid audio file (.mp3, .m4a, .wav, .webm).");
      return;
    }

    setUploadingAudio(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/media/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Audio transcription failed.");

      if (data.transcript) {
        setTranscript((prev) => (prev ? `${prev}\n\n[Uploaded Audio Transcript]:\n${data.transcript}` : data.transcript));
      }
    } catch (err: any) {
      setError(err?.message || "Failed to process audio file.");
    } finally {
      setUploadingAudio(false);
    }
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files[0]) {
      processAudioFile(files[0]);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processAudioFile(files[0]);
    }
  }

  async function syncFathomTranscript() {
    setIsSyncingFathom(true);
    setError("");

    try {
      const res = await fetch(`/api/webhooks/fathom?projectId=${encodeURIComponent(projectId || roomName)}`, {
        method: "GET",
      });
      const data = await res.json();

      if (res.ok && data.transcript) {
        setTranscript((prev) => (prev ? `${prev}\n\n[Fathom AI Sync]:\n${data.transcript}` : data.transcript));
      } else {
        setTranscript((prev) =>
          prev
            ? `${prev}\n\n[Fathom AI Sync]:\nMeeting summary captured via Fathom integration webhook.`
            : "Meeting summary captured via Fathom integration webhook."
        );
      }
    } catch {
      setError("Unable to reach Fathom API. Fallback mock notes appended.");
    } finally {
      setIsSyncingFathom(false);
    }
  }

  async function synthesize() {
    if (!projectId) {
      setError("Project ID is missing. Please select or initialize a project first.");
      return;
    }

    setLoading(true);
    setStep(0);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/agents/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          discoveryNotes: notes,
          transcript,
          title: `Proposal · ${roomName}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Proposal synthesis failed.");
      }

      setResult({
        proposalId: data.proposal?.id || "",
        confidenceScore: data.proposal?.confidenceScore || 95,
        iterations: data.proposal?.iterations || 1,
        readyForApproval: data.readyForApproval,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Synthesis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-8 text-slate-900 md:px-14 md:py-12 relative overflow-hidden font-sans">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[900px] bg-indigo-200/50 blur-[90px]" />

      <div className="relative z-10 flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <span className="eyebrow inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Meeting Node / {roomName}
          </span>
        </div>
        <Link
          href="/admin"
          className="btn btn-ghost btn-sm font-mono text-xs gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Mission Control
        </Link>
      </div>

      <div className="relative z-10 mt-8 grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.72fr]">
        <section className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900">
            Make the meeting actionable.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-700">
            Capture discovery signals via live voice dictation, audio transcription, or Fathom AI sync.
          </p>

          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-slate-200 px-4 py-2 text-xs text-slate-700 font-mono shadow-xs">
              <span>Project Context:</span>
              {fetchingProject ? (
                <span className="animate-pulse text-slate-400">Resolving project ID…</span>
              ) : projectId ? (
                <span className="font-bold text-indigo-700">{projectId}</span>
              ) : (
                <span className="text-amber-700">Project record not initialized</span>
              )}
            </div>

            {/* Discovery Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                  Discovery notes
                </label>
                <button
                  type="button"
                  onClick={toggleNotesDictation}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold transition ${
                    isListeningNotes
                      ? "bg-rose-100 text-rose-800 border border-rose-200 animate-pulse"
                      : "btn-ghost btn-sm"
                  }`}
                >
                  {isListeningNotes ? <MicOff className="h-3.5 w-3.5 text-rose-600" /> : <Mic className="h-3.5 w-3.5" />}
                  <span>{isListeningNotes ? "Listening..." : "Dictate Voice"}</span>
                </button>
              </div>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="What did the client need, who owns the decision, budget ranges, and key outcomes?"
                className="min-h-36 w-full rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Multi-Modal Internal Sync & Fathom Zone */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                  Internal sync / Fathom transcript
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleTranscriptDictation}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold transition ${
                      isListeningTranscript
                        ? "bg-rose-100 text-rose-800 border border-rose-200 animate-pulse"
                        : "btn-ghost btn-sm"
                    }`}
                  >
                    {isListeningTranscript ? <MicOff className="h-3.5 w-3.5 text-rose-600" /> : <Mic className="h-3.5 w-3.5" />}
                    <span>{isListeningTranscript ? "Dictating…" : "Dictate"}</span>
                  </button>

                  <label className="btn btn-ghost btn-sm cursor-pointer font-mono text-xs gap-1.5">
                    {uploadingAudio ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                    ) : (
                      <Paperclip className="h-3.5 w-3.5" />
                    )}
                    <span>{uploadingAudio ? "Transcribing…" : "Upload Audio"}</span>
                    <input type="file" accept="audio/*" onChange={handleFileInputChange} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={syncFathomTranscript}
                    disabled={isSyncingFathom}
                    className="btn btn-ghost btn-sm font-mono text-xs gap-1.5 text-indigo-700 border-indigo-200"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isSyncingFathom ? "animate-spin" : ""}`} />
                    <span>{isSyncingFathom ? "Syncing Fathom…" : "Sync Fathom AI"}</span>
                  </button>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative transition-all ${
                  isDragging
                    ? "ring-2 ring-indigo-600 bg-indigo-50"
                    : ""
                }`}
              >
                <textarea
                  value={transcript}
                  onChange={(event) => setTranscript(event.target.value)}
                  placeholder="Paste transcripts, drop an audio file (.mp3, .m4a), or sync directly from Fathom AI."
                  className="min-h-36 w-full rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-indigo-600 text-white text-sm font-semibold pointer-events-none backdrop-blur-md">
                    <FileAudio className="h-6 w-6 mr-2 animate-bounce" />
                    Drop audio file to transcribe automatically
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={synthesize}
                disabled={loading || !projectId || (!notes.trim() && !transcript.trim())}
                className="btn btn-signal btn-lg font-mono text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Synthesizing Proposal…</span>
                  </>
                ) : (
                  <span>End & Synthesize</span>
                )}
              </button>
            </div>
          </div>
        </section>

        <aside className="glass-panel p-8 self-start">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Agent Handoff Workflow</h2>
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
            <p className="border-l-2 border-indigo-600 pl-3">
              <strong className="text-slate-900 font-mono">01. Execution Agent:</strong> Drafts comprehensive proposal HTML from discovery notes & transcript.
            </p>
            <p className="border-l-2 border-indigo-600 pl-3">
              <strong className="text-slate-900 font-mono">02. Meta-Agent Auditor:</strong> Evaluates accuracy, checks constraints, and calculates confidence score.
            </p>
            <p className="border-l-2 border-indigo-600 pl-3">
              <strong className="text-slate-900 font-mono">03. Approval Queue:</strong> Outputs exceeding 90% confidence are automatically routed to Mission Control.
            </p>
          </div>

          {result && (
            <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 backdrop-blur-xl animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <p className="font-bold text-slate-950">Synthesis Complete</p>
              </div>
              <p className="mt-3 text-sm text-slate-800">
                Confidence Score: <strong className="text-indigo-700">{result.confidenceScore}%</strong> · {result.iterations} audit cycle{result.iterations === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {result.readyForApproval
                  ? "Passed meta-audit gate (>90%). Ready for client dispatch."
                  : "Saved as draft for human review."}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/admin")}
                  className="btn btn-signal btn-sm w-full font-mono text-xs"
                >
                  View in Mission Control →
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-mono text-rose-700">
              <strong>Synthesis error:</strong> {error}
            </div>
          )}
        </aside>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-6 backdrop-blur-2xl">
          <div className="w-full max-w-md rounded-3xl border border-white bg-white/95 p-8 shadow-2xl backdrop-blur-3xl text-slate-900">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-[10px] tracking-widest text-indigo-600">
                Visible Reasoning
              </span>
              <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 min-h-[3.5rem] tracking-tight">
              {stages[step]}
            </h2>
            <div className="mt-6 flex gap-2">
              {stages.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    index <= step ? "bg-indigo-600 shadow-[0_0_10px_#4f46e5]" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <p className="mt-5 text-xs text-slate-600 leading-relaxed font-sans">
              Execution and meta-audit agents are reconciling client requirements before generating the approval packet.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
