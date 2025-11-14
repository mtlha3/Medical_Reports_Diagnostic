'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Bone, Heart, Zap, Send, Upload, X, ChevronDown, ChevronUp, Settings } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../api/api'

const AnalysisPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const modelId = searchParams.get('model') || 'brain'
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const models = [
    {
      id: 'brain',
      name: 'Brain Tumor Detection',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      accentColor: 'text-blue-400',
      borderColor: 'border-blue-400',
      description: 'Detect and analyze brain tumors from MRI and CT scans',
    },
    {
      id: 'bone',
      name: 'Bone Fracture Detection',
      icon: Bone,
      color: 'from-orange-500 to-amber-500',
      accentColor: 'text-orange-400',
      borderColor: 'border-orange-400',
      description: 'Identify bone fractures from X-ray images',
    },
    {
      id: 'heart',
      name: 'Heart ECG Analysis',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      accentColor: 'text-red-400',
      borderColor: 'border-red-400',
      description: 'Analyze ECG readings for cardiac abnormalities',
    },
    {
      id: 'chest',
      name: 'Chest X-Ray Analysis',
      icon: Zap,
      color: 'from-emerald-500 to-green-500',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-400',
      description: 'Comprehensive chest X-ray analysis',
    },
  ]

  const currentModel = models.find((m) => m.id === modelId) || models[0]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      image: selectedImage,
      model: modelId,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputValue('')
    setSelectedImage(null)
    setIsLoading(true)

    // Simulate API call to analysis backend
    setTimeout(() => {
      const analysisResult = {
        id: Date.now() + 1,
        type: 'analysis',
        content: `Analysis Result for ${currentModel.name}:\n\nBased on the uploaded image, our AI model has completed the analysis. The results show:\n\n• Confidence Level: 94.5%\n• Key Findings: Normal\n• Recommendations: Continue regular checkups\n\nThis is a simulated analysis. Connect your backend API for real analysis.`,
        model: modelId,
        timestamp: new Date(),
        confidence: 94.5,
      }
      setMessages((prev) => [...prev, analysisResult])
      setIsLoading(false)
    }, 2000)
  }

  const handleModelChange = (modelId) => {
    setSearchParams({ model: modelId })
  }

  const IconComponent = currentModel.icon

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        />
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        className={`${
          sidebarOpen ? 'w-80' : 'w-20'
        } bg-slate-900/80 backdrop-blur-sm border-r border-slate-700 flex flex-col transition-all duration-300 relative z-20`}
      >
        {/* Toggle Button */}
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 p-2 rounded-full hover:bg-slate-700 transition"
          whileHover={{ scale: 1.1 }}
        >
          {sidebarOpen ? <ChevronUp size={18} className="text-cyan-400" /> : <ChevronDown size={18} className="text-cyan-400" />}
        </motion.button>

        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : -90 }}
            className="flex items-center gap-3"
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${currentModel.color}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-cyan-300 text-sm">Analysis Models</h2>
                <p className="text-xs text-slate-400">Select a model</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Models List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {models.map((model) => {
            const ModelIcon = model.icon
            const isActive = model.id === modelId
            return (
              <motion.button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${model.color} text-white`
                    : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ModelIcon size={20} />
                  {sidebarOpen && (
                    <div>
                      <p className="font-semibold text-sm">{model.name}</p>
                      <p className="text-xs opacity-70 line-clamp-1">{model.description}</p>
                    </div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Settings */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-slate-700"
          >
            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 transition">
              <Settings size={18} />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <motion.div
          className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm p-6 flex items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`p-3 rounded-xl bg-gradient-to-br ${currentModel.color}`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${currentModel.accentColor}`}>{currentModel.name}</h1>
            <p className="text-slate-400 text-sm">{currentModel.description}</p>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.length === 0 ? (
            <motion.div
              className="h-full flex items-center justify-center flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className={`p-6 rounded-2xl bg-gradient-to-br ${currentModel.color}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <IconComponent className="w-16 h-16 text-white" />
              </motion.div>
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold text-cyan-300 mb-2">Ready for Analysis</h2>
                <p className="text-slate-400">Upload an image or describe your analysis request to get started.</p>
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-6 py-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold'
                        : `bg-slate-800/80 border border-${currentModel.id}-400/30 text-slate-200`
                    }`}
                  >
                    {message.image && (
                      <motion.img
                        src={message.image}
                        alt="uploaded"
                        className="w-full h-48 object-cover rounded-lg mb-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      />
                    )}
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    {message.confidence && (
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <p className={`text-xs ${currentModel.accentColor}`}>
                          Confidence: {message.confidence.toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-slate-800/80 px-6 py-4 rounded-2xl">
                    <motion.div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className={`w-2 h-2 rounded-full bg-${currentModel.id}-400`}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ delay: i * 0.1, duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <motion.div
          className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {selectedImage && (
            <motion.div
              className="mb-4 relative inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img src={selectedImage || "/placeholder.svg"} alt="preview" className="w-20 h-20 rounded-lg object-cover border border-cyan-400" />
              <motion.button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full text-white hover:bg-red-600"
                whileHover={{ scale: 1.1 }}
              >
                <X size={14} />
              </motion.button>
            </motion.div>
          )}

          <div className="flex gap-4 items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleImageSelect}
              className="hidden"
            />

            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload size={20} />
            </motion.button>

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your analysis or ask a question..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 text-slate-100 placeholder-slate-500 focus:border-cyan-400 outline-none resize-none max-h-24"
              rows="1"
            />

            <motion.button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold border border-slate-700 disabled:opacity-50 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalysisPage
