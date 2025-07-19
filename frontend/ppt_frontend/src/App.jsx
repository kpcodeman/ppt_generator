import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Upload, 
  FileText, 
  Image, 
  Download, 
  Sparkles, 
  Settings, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Presentation
} from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('text')
  const [userInput, setUserInput] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [endpoint, setEndpoint] = useState('https://api.openai.com/v1/chat/completions')
  const [model, setModel] = useState('gpt-3.5-turbo')
  const [sessionId, setSessionId] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pptStructure, setPptStructure] = useState(null)
  const [thumbnails, setThumbnails] = useState([])
  const [downloadUrl, setDownloadUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [refinementPrompt, setRefinementPrompt] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const fileInputRef = useRef(null)

  // Use relative paths for API calls - Vercel will handle routing
  const API_BASE = ''

  const resetState = () => {
    setError('')
    setSuccess('')
    setProgress(0)
  }

  const handleGenerate = async () => {
    if (!userInput.trim() || !apiKey.trim()) {
      setError('Please provide both input text and API key')
      return
    }

    resetState()
    setIsGenerating(true)
    setProgress(20)

    try {
      const response = await fetch(`${API_BASE}/api/ppt/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userInput,
          api_key: apiKey,
          endpoint: endpoint,
          model: model,
          session_id: sessionId
        })
      })

      setProgress(60)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setProgress(80)
      setSessionId(data.session_id)
      setPptStructure(data.structure)
      setThumbnails(data.thumbnails)
      setDownloadUrl(data.download_url)
      setProgress(100)
      setSuccess('Presentation generated successfully!')

    } catch (err) {
      setError(`Error generating presentation: ${err.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRefine = async () => {
    if (!refinementPrompt.trim() || !sessionId) {
      setError('Please provide refinement instructions')
      return
    }

    resetState()
    setIsRefining(true)
    setProgress(20)

    try {
      const response = await fetch(`${API_BASE}/api/ppt/refine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          prompt: refinementPrompt
        })
      })

      setProgress(60)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setProgress(80)
      setPptStructure(data.structure)
      setThumbnails(data.thumbnails)
      setDownloadUrl(data.download_url)
      setProgress(100)
      setSuccess('Presentation refined successfully!')
      setRefinementPrompt('')

    } catch (err) {
      setError(`Error refining presentation: ${err.message}`)
    } finally {
      setIsRefining(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploadedFile(file)
    resetState()
    setProgress(20)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE}/api/ppt/upload`, {
        method: 'POST',
        body: formData
      })

      setProgress(60)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setProgress(100)
      setSessionId(data.session_id)
      setSuccess(`${file.name} uploaded successfully! Configure your LLM settings and click "Analyze Upload" to generate presentation.`)

    } catch (err) {
      setError(`Error uploading file: ${err.message}`)
    }
  }

  const handleAnalyzeUpload = async () => {
    if (!sessionId || !apiKey.trim()) {
      setError('Please upload a file and provide API key')
      return
    }

    resetState()
    setIsGenerating(true)
    setProgress(20)

    try {
      const response = await fetch(`${API_BASE}/api/ppt/analyze-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          api_key: apiKey,
          endpoint: endpoint,
          model: model
        })
      })

      setProgress(60)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setProgress(80)
      setPptStructure(data.structure)
      setThumbnails(data.thumbnails)
      setDownloadUrl(data.download_url)
      setProgress(100)
      setSuccess('Presentation generated from upload successfully!')

    } catch (err) {
      setError(`Error analyzing upload: ${err.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(`${API_BASE}${downloadUrl}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Presentation className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">PPT Generator</h1>
          </div>
          <p className="text-lg text-gray-600">AI-Powered Presentation Creation Tool</p>
        </div>

        {/* Progress Bar */}
        {(isGenerating || isRefining) && (
          <div className="mb-6">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2 text-center">
              {isGenerating ? 'Generating presentation...' : 'Refining presentation...'}
            </p>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Create Your Presentation
                </CardTitle>
                <CardDescription>
                  Choose your input method and configure your LLM settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Text Input
                    </TabsTrigger>
                    <TabsTrigger value="image" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Image Upload
                    </TabsTrigger>
                    <TabsTrigger value="ppt" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      PPT Upload
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="userInput">Describe your presentation</Label>
                      <Textarea
                        id="userInput"
                        placeholder="Describe what you want your presentation to be about. For example: 'Create a presentation about renewable energy sources, including solar, wind, and hydroelectric power. Focus on benefits and implementation strategies.'"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <div>
                      <Label>Upload an image for inspiration</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-32 border-dashed"
                          disabled={isGenerating}
                        >
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p>Click to upload image</p>
                            <p className="text-sm text-gray-500">JPG, PNG, GIF up to 16MB</p>
                          </div>
                        </Button>
                      </div>
                      {uploadedFile && (
                        <p className="text-sm text-green-600 mt-2">
                          Uploaded: {uploadedFile.name}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="ppt" className="space-y-4">
                    <div>
                      <Label>Upload existing PowerPoint</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept=".ppt,.pptx"
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-32 border-dashed"
                          disabled={isGenerating}
                        >
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p>Click to upload PowerPoint</p>
                            <p className="text-sm text-gray-500">PPT, PPTX up to 16MB</p>
                          </div>
                        </Button>
                      </div>
                      {uploadedFile && (
                        <p className="text-sm text-green-600 mt-2">
                          Uploaded: {uploadedFile.name}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* LLM Configuration */}
                <div className="mt-6 space-y-4 border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4" />
                    <Label className="text-base font-medium">LLM Configuration</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your LLM API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endpoint">API Endpoint</Label>
                    <Input
                      id="endpoint"
                      placeholder="https://api.openai.com/v1/chat/completions"
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="gpt-3.5-turbo"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  {activeTab === 'text' ? (
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating || !userInput.trim() || !apiKey.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Presentation
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleAnalyzeUpload} 
                      disabled={isGenerating || !sessionId || !apiKey.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze Upload
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Refinement Section */}
            {pptStructure && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Refine Your Presentation
                  </CardTitle>
                  <CardDescription>
                    Make adjustments to improve your presentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="refinementPrompt">Refinement Instructions</Label>
                      <Textarea
                        id="refinementPrompt"
                        placeholder="Describe how you want to modify the presentation. For example: 'Add more technical details to slide 3' or 'Make the tone more casual and friendly'"
                        value={refinementPrompt}
                        onChange={(e) => setRefinementPrompt(e.target.value)}
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                    <Button 
                      onClick={handleRefine} 
                      disabled={isRefining || !refinementPrompt.trim()}
                      className="w-full"
                    >
                      {isRefining ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Refining...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refine Presentation
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div>
            {pptStructure ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Generated Presentation
                  </CardTitle>
                  <CardDescription>
                    {pptStructure.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Download Button */}
                    <Button 
                      onClick={handleDownload} 
                      className="w-full"
                      disabled={!downloadUrl}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PowerPoint
                    </Button>

                    {/* Theme Info */}
                    {pptStructure.theme && (
                      <div>
                        <Label className="text-sm font-medium">Theme Colors</Label>
                        <div className="flex gap-2 mt-2">
                          {Object.entries(pptStructure.theme).map(([key, color]) => (
                            <div key={key} className="text-center">
                              <div 
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: color }}
                              ></div>
                              <p className="text-xs mt-1 capitalize">{key.replace('_', ' ')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Slides Preview */}
                    <div>
                      <Label className="text-sm font-medium">Slides ({pptStructure.slides?.length || 0})</Label>
                      <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                        {pptStructure.slides?.map((slide, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-gray-50">
                            <h4 className="font-medium text-sm">{index + 1}. {slide.title}</h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{slide.content}</p>
                            {slide.bullet_points && slide.bullet_points.length > 0 && (
                              <div className="mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {slide.bullet_points.length} bullet points
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Thumbnails */}
                    {thumbnails.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Thumbnails</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {thumbnails.map((thumb, index) => (
                            <div key={index} className="text-center">
                              <img 
                                src={`${API_BASE}${thumb.thumbnail_url}`}
                                alt={`Slide ${thumb.slide_number}`}
                                className="w-full h-20 object-cover border rounded"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                }}
                              />
                              <p className="text-xs mt-1">Slide {thumb.slide_number}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    <Presentation className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your generated presentation will appear here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

