import { AnalyzerSection } from './components/sections/AnalyzerSection'
import { LanguageSection } from './components/sections/LanguageSection'
import { ReviewSection } from './components/sections/ReviewSection'
import { RewriteDrawer } from './components/sections/RewriteDrawer'
import { ScriptSection } from './components/sections/ScriptSection'
import { SettingsSection } from './components/sections/SettingsSection'
import { useShallow } from 'zustand/react/shallow'
import { buildContentReviewPrompt, defaultContentReviewProfile } from './lib/contentReviewProfile'
import { defaultEvaluationProfile } from './lib/evaluationProfile'
import { defaultLanguageAnalysisProfile } from './lib/languageAnalysisProfile'
import { buildRewritePrompt } from './lib/prompts/rewritePrompt'
import { buildScriptEvaluationPrompt, defaultScriptEvaluationProfile } from './lib/scriptEvaluationProfile'
import { analyzeContentReview, analyzeLanguage, analyzeScriptEvaluation, analyzeWithOpenRouter, rewriteWithOpenRouter } from './lib/openrouter'
import {
  headerCopy,
  infoMetricMeta,
  languageMetricMeta,
  languageTextTypes,
  reviewMetricMeta,
  reviewModeMeta,
  reviewPlatforms,
  rewriteModeMeta,
  rewriteModesByView,
  scriptFormatOptions,
  scriptLengthOptions,
  scriptMetricMeta,
  scriptPlatforms
} from './lib/ui/appConfig'
import {
  buildLanguageInput,
  buildReviewInput,
  buildRewriteInput,
  buildScriptInput,
  replaceFirstOccurrence
} from './lib/ui/appHelpers'
import { useAppStore } from './store/useAppStore'
import { useSettingsStore } from './store/useSettingsStore'

export default function App () {
  const {
    view,
    setView,
    infoInput,
    infoScores,
    infoReasons,
    infoSummary,
    infoProfile,
    infoUsage,
    infoActiveModel,
    infoError,
    isInfoAnalyzing,
    setInfoInput,
    setInfoScores,
    setInfoReasons,
    setInfoSummary,
    setInfoProfile,
    setInfoUsage,
    setInfoActiveModel,
    setInfoError,
    setIsInfoAnalyzing,
    reviewMode,
    reviewPlatform,
    reviewTitle,
    reviewBody,
    reviewCover,
    reviewResult,
    reviewUsage,
    reviewActiveModel,
    reviewError,
    isReviewAnalyzing,
    setReviewMode,
    setReviewPlatform,
    setReviewTitle,
    setReviewBody,
    setReviewCover,
    setReviewResult,
    setReviewUsage,
    setReviewActiveModel,
    setReviewError,
    setIsReviewAnalyzing,
    scriptPlatform,
    scriptVideoLength,
    scriptFormat,
    scriptTitle,
    scriptBody,
    scriptResult,
    scriptUsage,
    scriptActiveModel,
    scriptError,
    isScriptAnalyzing,
    setScriptPlatform,
    setScriptVideoLength,
    setScriptFormat,
    setScriptTitle,
    setScriptBody,
    setScriptResult,
    setScriptUsage,
    setScriptActiveModel,
    setScriptError,
    setIsScriptAnalyzing,
    languageTextType,
    languageTitle,
    languageBody,
    languageResult,
    languageUsage,
    languageActiveModel,
    languageError,
    isLanguageAnalyzing,
    setLanguageTextType,
    setLanguageTitle,
    setLanguageBody,
    setLanguageResult,
    setLanguageUsage,
    setLanguageActiveModel,
    setLanguageError,
    setIsLanguageAnalyzing,
    isRewriteOpen,
    rewriteSourceView,
    rewriteMode,
    rewriteOriginalText,
    rewriteSummary,
    rewriteProblems,
    rewriteSuggestions,
    rewriteCustomInstruction,
    rewriteResult,
    rewriteUsage,
    rewriteActiveModel,
    rewriteError,
    isRewriting,
    rewriteComparison,
    rewriteTextView,
    rewriteSelection,
    rewriteLocalReanalysis,
    setIsRewriteOpen,
    setRewriteSourceView,
    setRewriteMode,
    setRewriteOriginalText,
    setRewriteSummary,
    setRewriteProblems,
    setRewriteSuggestions,
    setRewriteCustomInstruction,
    setRewriteResult,
    setRewriteUsage,
    setRewriteActiveModel,
    setRewriteError,
    setIsRewriting,
    setRewriteComparison,
    setRewriteComparisonTab,
    setRewriteTextView,
    setRewriteSelection,
    setRewriteLocalReanalysis
  } = useAppStore(
    useShallow((state) => ({
      view: state.view,
      setView: state.setView,
      infoInput: state.infoInput,
      infoScores: state.infoScores,
      infoReasons: state.infoReasons,
      infoSummary: state.infoSummary,
      infoProfile: state.infoProfile,
      infoUsage: state.infoUsage,
      infoActiveModel: state.infoActiveModel,
      infoError: state.infoError,
      isInfoAnalyzing: state.isInfoAnalyzing,
      setInfoInput: state.setInfoInput,
      setInfoScores: state.setInfoScores,
      setInfoReasons: state.setInfoReasons,
      setInfoSummary: state.setInfoSummary,
      setInfoProfile: state.setInfoProfile,
      setInfoUsage: state.setInfoUsage,
      setInfoActiveModel: state.setInfoActiveModel,
      setInfoError: state.setInfoError,
      setIsInfoAnalyzing: state.setIsInfoAnalyzing,
      reviewMode: state.reviewMode,
      reviewPlatform: state.reviewPlatform,
      reviewTitle: state.reviewTitle,
      reviewBody: state.reviewBody,
      reviewCover: state.reviewCover,
      reviewResult: state.reviewResult,
      reviewUsage: state.reviewUsage,
      reviewActiveModel: state.reviewActiveModel,
      reviewError: state.reviewError,
      isReviewAnalyzing: state.isReviewAnalyzing,
      setReviewMode: state.setReviewMode,
      setReviewPlatform: state.setReviewPlatform,
      setReviewTitle: state.setReviewTitle,
      setReviewBody: state.setReviewBody,
      setReviewCover: state.setReviewCover,
      setReviewResult: state.setReviewResult,
      setReviewUsage: state.setReviewUsage,
      setReviewActiveModel: state.setReviewActiveModel,
      setReviewError: state.setReviewError,
      setIsReviewAnalyzing: state.setIsReviewAnalyzing,
      scriptPlatform: state.scriptPlatform,
      scriptVideoLength: state.scriptVideoLength,
      scriptFormat: state.scriptFormat,
      scriptTitle: state.scriptTitle,
      scriptBody: state.scriptBody,
      scriptResult: state.scriptResult,
      scriptUsage: state.scriptUsage,
      scriptActiveModel: state.scriptActiveModel,
      scriptError: state.scriptError,
      isScriptAnalyzing: state.isScriptAnalyzing,
      setScriptPlatform: state.setScriptPlatform,
      setScriptVideoLength: state.setScriptVideoLength,
      setScriptFormat: state.setScriptFormat,
      setScriptTitle: state.setScriptTitle,
      setScriptBody: state.setScriptBody,
      setScriptResult: state.setScriptResult,
      setScriptUsage: state.setScriptUsage,
      setScriptActiveModel: state.setScriptActiveModel,
      setScriptError: state.setScriptError,
      setIsScriptAnalyzing: state.setIsScriptAnalyzing,
      languageTextType: state.languageTextType,
      languageTitle: state.languageTitle,
      languageBody: state.languageBody,
      languageResult: state.languageResult,
      languageUsage: state.languageUsage,
      languageActiveModel: state.languageActiveModel,
      languageError: state.languageError,
      isLanguageAnalyzing: state.isLanguageAnalyzing,
      setLanguageTextType: state.setLanguageTextType,
      setLanguageTitle: state.setLanguageTitle,
      setLanguageBody: state.setLanguageBody,
      setLanguageResult: state.setLanguageResult,
      setLanguageUsage: state.setLanguageUsage,
      setLanguageActiveModel: state.setLanguageActiveModel,
      setLanguageError: state.setLanguageError,
      setIsLanguageAnalyzing: state.setIsLanguageAnalyzing,
      isRewriteOpen: state.isRewriteOpen,
      rewriteSourceView: state.rewriteSourceView,
      rewriteMode: state.rewriteMode,
      rewriteOriginalText: state.rewriteOriginalText,
      rewriteSummary: state.rewriteSummary,
      rewriteProblems: state.rewriteProblems,
      rewriteSuggestions: state.rewriteSuggestions,
      rewriteCustomInstruction: state.rewriteCustomInstruction,
      rewriteResult: state.rewriteResult,
      rewriteUsage: state.rewriteUsage,
      rewriteActiveModel: state.rewriteActiveModel,
      rewriteError: state.rewriteError,
      isRewriting: state.isRewriting,
      rewriteComparison: state.rewriteComparison,
      rewriteTextView: state.rewriteTextView,
      rewriteSelection: state.rewriteSelection,
      rewriteLocalReanalysis: state.rewriteLocalReanalysis,
      setIsRewriteOpen: state.setIsRewriteOpen,
      setRewriteSourceView: state.setRewriteSourceView,
      setRewriteMode: state.setRewriteMode,
      setRewriteOriginalText: state.setRewriteOriginalText,
      setRewriteSummary: state.setRewriteSummary,
      setRewriteProblems: state.setRewriteProblems,
      setRewriteSuggestions: state.setRewriteSuggestions,
      setRewriteCustomInstruction: state.setRewriteCustomInstruction,
      setRewriteResult: state.setRewriteResult,
      setRewriteUsage: state.setRewriteUsage,
      setRewriteActiveModel: state.setRewriteActiveModel,
      setRewriteError: state.setRewriteError,
      setIsRewriting: state.setIsRewriting,
      setRewriteComparison: state.setRewriteComparison,
      setRewriteComparisonTab: state.setRewriteComparisonTab,
      setRewriteTextView: state.setRewriteTextView,
      setRewriteSelection: state.setRewriteSelection,
      setRewriteLocalReanalysis: state.setRewriteLocalReanalysis
    }))
  )

  const openRouterApiKey = useSettingsStore((state) => state.openRouterApiKey)
  const openRouterModelId = useSettingsStore((state) => state.openRouterModelId)
  const customSystemPrompt = useSettingsStore((state) => state.customSystemPrompt)
  const customTemperature = useSettingsStore((state) => state.customTemperature)
  const setOpenRouterApiKey = useSettingsStore((state) => state.setOpenRouterApiKey)
  const setOpenRouterModelId = useSettingsStore((state) => state.setOpenRouterModelId)
  const setCustomSystemPrompt = useSettingsStore((state) => state.setCustomSystemPrompt)
  const setCustomTemperature = useSettingsStore((state) => state.setCustomTemperature)
  const resetEvaluationSettings = useSettingsStore((state) => state.resetEvaluationSettings)

  const parsedTemperature = Number(customTemperature)
  const resolvedInfoTemperature =
    customTemperature === '' || !Number.isFinite(parsedTemperature)
      ? defaultEvaluationProfile.temperature
      : Math.min(2, Math.max(0, parsedTemperature))
  const resolvedReviewTemperature =
    customTemperature === '' || !Number.isFinite(parsedTemperature)
      ? defaultContentReviewProfile.temperature
      : Math.min(2, Math.max(0, parsedTemperature))
  const resolvedScriptTemperature =
    customTemperature === '' || !Number.isFinite(parsedTemperature)
      ? defaultScriptEvaluationProfile.temperature
      : Math.min(2, Math.max(0, parsedTemperature))
  const resolvedLanguageTemperature =
    customTemperature === '' || !Number.isFinite(parsedTemperature)
      ? defaultLanguageAnalysisProfile.temperature
      : Math.min(2, Math.max(0, parsedTemperature))
  const resolvedRewriteTemperature = 0.2
  const resolvedInfoPrompt = customSystemPrompt.trim() || defaultEvaluationProfile.systemPrompt

  const maskedApiKey = openRouterApiKey
    ? `${openRouterApiKey.slice(0, 6)}...${openRouterApiKey.slice(-4)}`
    : '未配置'

  async function handleInfoAnalyze () {
    const { infoInput: latestInfoInput } = useAppStore.getState()
    const trimmedInput = latestInfoInput.trim()

    if (!trimmedInput) {
      setInfoError('请先输入要分析的内容。')
      return
    }

    if (!openRouterApiKey.trim()) {
      setInfoError('请先在设置页填写 OpenRouter API Key。')
      setView('settings')
      return
    }

    if (!openRouterModelId.trim()) {
      setInfoError('请先在设置页填写模型 ID。')
      setView('settings')
      return
    }

    setIsInfoAnalyzing(true)
    setInfoError('')

    try {
      const result = await analyzeWithOpenRouter({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: trimmedInput,
        systemPrompt: resolvedInfoPrompt,
        temperature: resolvedInfoTemperature,
        maxTokens: defaultEvaluationProfile.maxTokens
      })

      setInfoScores(result.analysis.scores)
      setInfoReasons(result.analysis.reasons)
      setInfoSummary(result.analysis.summary)
      setInfoProfile(result.analysis.profile)
      setInfoActiveModel(result.model)
      setInfoUsage(result.usage)
      return result.analysis
    } catch (analysisError) {
      setInfoError(analysisError.message)
      return null
    } finally {
      setIsInfoAnalyzing(false)
    }
  }

  async function handleReviewAnalyze () {
    const {
      reviewMode: latestReviewMode,
      reviewPlatform: latestReviewPlatform,
      reviewTitle: latestReviewTitle,
      reviewBody: latestReviewBody,
      reviewCover: latestReviewCover
    } = useAppStore.getState()

    if (!latestReviewTitle.trim() && !latestReviewBody.trim() && !latestReviewCover.trim()) {
      setReviewError('请至少输入标题、正文或封面文案中的一项。')
      return
    }

    if (!openRouterApiKey.trim()) {
      setReviewError('请先在设置页填写 OpenRouter API Key。')
      setView('settings')
      return
    }

    if (!openRouterModelId.trim()) {
      setReviewError('请先在设置页填写模型 ID。')
      setView('settings')
      return
    }

    setIsReviewAnalyzing(true)
    setReviewError('')

    try {
      const result = await analyzeContentReview({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: buildReviewInput({
          mode: latestReviewMode,
          platform: latestReviewPlatform,
          title: latestReviewTitle.trim(),
          body: latestReviewBody.trim(),
          cover: latestReviewCover.trim(),
          reviewModeMeta
        }),
        systemPrompt: buildContentReviewPrompt(latestReviewPlatform),
        temperature: resolvedReviewTemperature,
        maxTokens: defaultContentReviewProfile.maxTokens
      })

      setReviewResult(result.review)
      setReviewActiveModel(result.model)
      setReviewUsage(result.usage)
      return result.review
    } catch (analysisError) {
      setReviewError(analysisError.message)
      return null
    } finally {
      setIsReviewAnalyzing(false)
    }
  }

  async function handleScriptAnalyze () {
    const {
      scriptPlatform: latestScriptPlatform,
      scriptVideoLength: latestScriptVideoLength,
      scriptFormat: latestScriptFormat,
      scriptTitle: latestScriptTitle,
      scriptBody: latestScriptBody
    } = useAppStore.getState()

    if (!latestScriptTitle.trim() && !latestScriptBody.trim()) {
      setScriptError('请至少输入标题或脚本正文。')
      return
    }

    if (!openRouterApiKey.trim()) {
      setScriptError('请先在设置页填写 OpenRouter API Key。')
      setView('settings')
      return
    }

    if (!openRouterModelId.trim()) {
      setScriptError('请先在设置页填写模型 ID。')
      setView('settings')
      return
    }

    setIsScriptAnalyzing(true)
    setScriptError('')

    try {
      const result = await analyzeScriptEvaluation({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: buildScriptInput({
          platform: latestScriptPlatform,
          videoLength: latestScriptVideoLength,
          scriptFormat: latestScriptFormat,
          title: latestScriptTitle.trim(),
          body: latestScriptBody.trim()
        }),
        systemPrompt: buildScriptEvaluationPrompt(latestScriptPlatform),
        temperature: resolvedScriptTemperature,
        maxTokens: defaultScriptEvaluationProfile.maxTokens
      })

      setScriptResult(result.evaluation)
      setScriptActiveModel(result.model)
      setScriptUsage(result.usage)
      return result.evaluation
    } catch (analysisError) {
      setScriptError(analysisError.message)
      return null
    } finally {
      setIsScriptAnalyzing(false)
    }
  }

  async function handleLanguageAnalyze () {
    const {
      languageTextType: latestLanguageTextType,
      languageTitle: latestLanguageTitle,
      languageBody: latestLanguageBody
    } = useAppStore.getState()

    if (!latestLanguageTitle.trim() && !latestLanguageBody.trim()) {
      setLanguageError('请至少输入标题或正文。')
      return
    }

    if (!openRouterApiKey.trim()) {
      setLanguageError('请先在设置页填写 OpenRouter API Key。')
      setView('settings')
      return
    }

    if (!openRouterModelId.trim()) {
      setLanguageError('请先在设置页填写模型 ID。')
      setView('settings')
      return
    }

    setIsLanguageAnalyzing(true)
    setLanguageError('')

    try {
      const result = await analyzeLanguage({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: buildLanguageInput({
          textType: latestLanguageTextType,
          title: latestLanguageTitle.trim(),
          body: latestLanguageBody.trim()
        }),
        systemPrompt: defaultLanguageAnalysisProfile.systemPrompt,
        temperature: resolvedLanguageTemperature,
        maxTokens: defaultLanguageAnalysisProfile.maxTokens
      })

      setLanguageResult(result.analysis)
      setLanguageActiveModel(result.model)
      setLanguageUsage(result.usage)
      return result.analysis
    } catch (analysisError) {
      setLanguageError(analysisError.message)
      return null
    } finally {
      setIsLanguageAnalyzing(false)
    }
  }

  function openRewriteDrawer (sourceView) {
    const nextMode = rewriteModesByView[sourceView]?.[0] || 'conservative'
    let originalText = ''
    let summary = ''
    let problems = []
    let suggestions = []

    if (sourceView === 'analyzer') {
      originalText = infoInput.trim()
      summary = infoSummary
      problems = [infoProfile.weakestLink, infoProfile.slopRisk].filter(Boolean)
      suggestions = [infoProfile.coreJudgment, infoProfile.attentionWorth].filter(Boolean)
    }

    if (sourceView === 'script') {
      originalText = [scriptTitle.trim(), scriptBody.trim()].filter(Boolean).join('\n\n')
      summary = scriptResult.summary
      problems = scriptResult.problems
      suggestions = Object.values(scriptResult.revisionSuggestions).filter(Boolean)
    }

    if (sourceView === 'language') {
      originalText = [languageTitle.trim(), languageBody.trim()].filter(Boolean).join('\n\n')
      summary = languageResult.summary
      problems = languageResult.problems
      suggestions = Object.values(languageResult.revisionSuggestions).filter(Boolean)
    }

    if (sourceView === 'review') {
      originalText = [reviewTitle.trim(), reviewBody.trim(), reviewCover.trim()].filter(Boolean).join('\n\n')
      summary = `${reviewResult.riskLevel || '待判定'} / ${reviewResult.publishRecommendation || ''}`.trim()
      problems = reviewResult.hitPoints.map((item) => item.reason).filter(Boolean)
      suggestions = reviewResult.fixSuggestions.filter(Boolean)
    }

    setRewriteSourceView(sourceView)
    setRewriteMode(nextMode)
    setRewriteOriginalText(originalText)
    setRewriteSummary(summary)
    setRewriteProblems(problems.slice(0, 5))
    setRewriteSuggestions(suggestions.slice(0, 4))
    setRewriteCustomInstruction('')
    setRewriteResult({ rewrittenText: '', changeNotes: [], appliedFocus: '' })
    setRewriteUsage(null)
    setRewriteActiveModel('')
    setRewriteError('')
    setRewriteComparison({
      available: false,
      sourceView,
      beforeText: '',
      afterText: '',
      beforeResult: null,
      afterResult: null
    })
    setRewriteComparisonTab('scores')
    setRewriteTextView('side_by_side')
    setRewriteSelection({
      active: false,
      rowIndex: null,
      fullText: '',
      targetText: '',
      afterText: ''
    })
    setRewriteLocalReanalysis({
      available: false,
      isLoading: false,
      error: '',
      beforeResult: null,
      afterResult: null,
      topChanges: [],
      activeModel: '',
      usage: null
    })
    setIsRewriteOpen(true)
  }

  function handleSelectRewriteSegment (selection) {
    const nextTargetText = String(selection?.beforeText || selection?.afterText || '')

    if (!nextTargetText.trim()) {
      return
    }

    setRewriteSelection({
      active: true,
      rowIndex: selection.rowIndex,
      fullText: rewriteComparison.beforeText || rewriteOriginalText,
      targetText: nextTargetText,
      afterText: String(selection?.afterText || '')
    })
    setRewriteOriginalText(nextTargetText)
    setRewriteCustomInstruction('仅重写当前选中片段，保持全文其它部分不变。')
    setRewriteResult({ rewrittenText: '', changeNotes: [], appliedFocus: '' })
    setRewriteError('')
    setRewriteLocalReanalysis({
      available: false,
      isLoading: false,
      error: '',
      beforeResult: null,
      afterResult: null,
      topChanges: [],
      activeModel: '',
      usage: null
    })
  }

  function clearRewriteSelection () {
    const restoredText = rewriteComparison.beforeText || rewriteSelection.fullText || rewriteOriginalText

    setRewriteSelection({
      active: false,
      rowIndex: null,
      fullText: '',
      targetText: '',
      afterText: ''
    })
    setRewriteOriginalText(restoredText)

    if (rewriteCustomInstruction.trim() === '仅重写当前选中片段，保持全文其它部分不变。') {
      setRewriteCustomInstruction('')
    }

    setRewriteLocalReanalysis({
      available: false,
      isLoading: false,
      error: '',
      beforeResult: null,
      afterResult: null,
      topChanges: [],
      activeModel: '',
      usage: null
    })
  }

  async function handleRewriteGenerate () {
    if (!rewriteOriginalText.trim()) {
      setRewriteError('请先提供可改写的原文。')
      return
    }

    if (!openRouterApiKey.trim()) {
      setRewriteError('请先在设置页填写 OpenRouter API Key。')
      setView('settings')
      return
    }

    if (!openRouterModelId.trim()) {
      setRewriteError('请先在设置页填写模型 ID。')
      setView('settings')
      return
    }

    setIsRewriting(true)
    setRewriteError('')

    try {
      const result = await rewriteWithOpenRouter({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: buildRewriteInput({
          view: rewriteSourceView,
          mode: rewriteMode,
          originalText: rewriteOriginalText.trim(),
          summary: rewriteSummary,
          problems: rewriteProblems,
          suggestions: rewriteSuggestions,
          customInstruction: rewriteCustomInstruction.trim()
        }),
        systemPrompt: buildRewritePrompt({
          view: rewriteSourceView,
          mode: rewriteMode
        }),
        temperature: resolvedRewriteTemperature,
        maxTokens: 1400
      })

      setRewriteResult(result.rewrite)
      setRewriteActiveModel(result.model)
      setRewriteUsage(result.usage)
    } catch (analysisError) {
      setRewriteError(analysisError.message)
    } finally {
      setIsRewriting(false)
    }
  }

  async function analyzeSegmentForView (sourceView, text) {
    const trimmedText = String(text ?? '').trim()

    if (!trimmedText) {
      return null
    }

    if (sourceView === 'analyzer') {
      const result = await analyzeWithOpenRouter({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: trimmedText,
        systemPrompt: resolvedInfoPrompt,
        temperature: resolvedInfoTemperature,
        maxTokens: defaultEvaluationProfile.maxTokens
      })

      return {
        payload: result.analysis,
        model: result.model,
        usage: result.usage
      }
    }

    if (sourceView === 'script') {
      const currentState = useAppStore.getState()
      const result = await analyzeScriptEvaluation({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: buildScriptInput({
          platform: currentState.scriptPlatform,
          videoLength: currentState.scriptVideoLength,
          scriptFormat: currentState.scriptFormat,
          title: '',
          body: trimmedText
        }),
        systemPrompt: buildScriptEvaluationPrompt(currentState.scriptPlatform),
        temperature: resolvedScriptTemperature,
        maxTokens: defaultScriptEvaluationProfile.maxTokens
      })

      return {
        payload: result.evaluation,
        model: result.model,
        usage: result.usage
      }
    }

    if (sourceView === 'language') {
      const currentState = useAppStore.getState()
      const result = await analyzeLanguage({
        apiKey: openRouterApiKey.trim(),
        model: openRouterModelId.trim(),
        input: buildLanguageInput({
          textType: currentState.languageTextType,
          title: '',
          body: trimmedText
        }),
        systemPrompt: defaultLanguageAnalysisProfile.systemPrompt,
        temperature: resolvedLanguageTemperature,
        maxTokens: defaultLanguageAnalysisProfile.maxTokens
      })

      return {
        payload: result.analysis,
        model: result.model,
        usage: result.usage
      }
    }

    const currentState = useAppStore.getState()
    const result = await analyzeContentReview({
      apiKey: openRouterApiKey.trim(),
      model: openRouterModelId.trim(),
      input: buildReviewInput({
        mode: currentState.reviewMode,
        platform: currentState.reviewPlatform,
        title: '',
        body: trimmedText,
        cover: '',
        reviewModeMeta
      }),
      systemPrompt: buildContentReviewPrompt(currentState.reviewPlatform),
      temperature: resolvedReviewTemperature,
      maxTokens: defaultContentReviewProfile.maxTokens
    })

    return {
      payload: result.review,
      model: result.model,
      usage: result.usage
    }
  }

  async function handleReanalyzeSelectedSegment () {
    if (!rewriteSelection.active || !rewriteSelection.targetText.trim() || !rewriteResult.rewrittenText.trim()) {
      return
    }

    if (!openRouterApiKey.trim()) {
      setRewriteError('请先在设置页填写 OpenRouter API Key。')
      setView('settings')
      return
    }

    if (!openRouterModelId.trim()) {
      setRewriteError('请先在设置页填写模型 ID。')
      setView('settings')
      return
    }

    setRewriteLocalReanalysis({
      available: false,
      isLoading: true,
      error: '',
      beforeResult: null,
      afterResult: null,
      topChanges: [],
      activeModel: '',
      usage: null
    })

    try {
      const beforeAnalysis = await analyzeSegmentForView(rewriteSourceView, rewriteSelection.targetText)
      const afterAnalysis = await analyzeSegmentForView(rewriteSourceView, rewriteResult.rewrittenText)
      const summary = buildLocalReanalysisSummary(
        rewriteSourceView,
        beforeAnalysis?.payload ?? null,
        afterAnalysis?.payload ?? null
      )

      setRewriteLocalReanalysis({
        available: true,
        isLoading: false,
        error: '',
        beforeResult: beforeAnalysis?.payload ?? null,
        afterResult: afterAnalysis?.payload ?? null,
        topChanges: summary.topChanges,
        activeModel: afterAnalysis?.model || beforeAnalysis?.model || '',
        usage: afterAnalysis?.usage || beforeAnalysis?.usage || null
      })
    } catch (analysisError) {
      setRewriteLocalReanalysis({
        available: false,
        isLoading: false,
        error: analysisError.message,
        beforeResult: null,
        afterResult: null,
        topChanges: [],
        activeModel: '',
        usage: null
      })
    }
  }

  function applyRewriteToInput () {
    if (!rewriteResult.rewrittenText.trim()) {
      return
    }

    const nextText = rewriteSelection.active
      ? replaceFirstOccurrence(rewriteSelection.fullText, rewriteSelection.targetText, rewriteResult.rewrittenText)
      : rewriteResult.rewrittenText

    if (rewriteSourceView === 'analyzer') {
      setInfoInput(nextText)
      setView('analyzer')
    }

    if (rewriteSourceView === 'script') {
      setScriptBody(nextText)
      setView('script')
    }

    if (rewriteSourceView === 'language') {
      setLanguageBody(nextText)
      setView('language')
    }

    if (rewriteSourceView === 'review') {
      setReviewBody(nextText)
      setView('review')
    }

    setIsRewriteOpen(false)
    setRewriteComparison({
      available: false,
      sourceView: rewriteSourceView,
      beforeText: '',
      afterText: '',
      beforeResult: null,
      afterResult: null
    })
    setRewriteComparisonTab('scores')
    setRewriteTextView('side_by_side')
    setRewriteSelection({
      active: false,
      rowIndex: null,
      fullText: '',
      targetText: '',
      afterText: ''
    })
  }

  async function applyRewriteAndReanalyze () {
    if (!rewriteResult.rewrittenText.trim()) {
      return
    }

    const state = useAppStore.getState()
    const nextText = rewriteSelection.active
      ? replaceFirstOccurrence(rewriteSelection.fullText, rewriteSelection.targetText, rewriteResult.rewrittenText)
      : rewriteResult.rewrittenText
    const beforeText = rewriteSelection.active ? rewriteSelection.fullText : rewriteOriginalText

    if (rewriteSourceView === 'analyzer') {
      const beforeResult = {
        summary: state.infoSummary,
        scores: state.infoScores,
        reasons: state.infoReasons,
        profile: state.infoProfile
      }
      setInfoInput(nextText)
      setView('analyzer')
      const afterResult = await handleInfoAnalyze()
      if (afterResult) {
        setRewriteComparison({
          available: true,
          sourceView: rewriteSourceView,
          beforeText,
          afterText: nextText,
          beforeResult,
          afterResult
        })
        setRewriteComparisonTab('scores')
        setRewriteSelection({
          active: false,
          rowIndex: null,
          fullText: '',
          targetText: '',
          afterText: ''
        })
        setRewriteOriginalText(nextText)
      }
      return
    }

    if (rewriteSourceView === 'script') {
      const beforeResult = state.scriptResult
      setScriptBody(nextText)
      setView('script')
      const afterResult = await handleScriptAnalyze()
      if (afterResult) {
        setRewriteComparison({
          available: true,
          sourceView: rewriteSourceView,
          beforeText,
          afterText: nextText,
          beforeResult,
          afterResult
        })
        setRewriteComparisonTab('scores')
        setRewriteSelection({
          active: false,
          rowIndex: null,
          fullText: '',
          targetText: '',
          afterText: ''
        })
        setRewriteOriginalText(nextText)
      }
      return
    }

    if (rewriteSourceView === 'language') {
      const beforeResult = state.languageResult
      setLanguageBody(nextText)
      setView('language')
      const afterResult = await handleLanguageAnalyze()
      if (afterResult) {
        setRewriteComparison({
          available: true,
          sourceView: rewriteSourceView,
          beforeText,
          afterText: nextText,
          beforeResult,
          afterResult
        })
        setRewriteComparisonTab('scores')
        setRewriteSelection({
          active: false,
          rowIndex: null,
          fullText: '',
          targetText: '',
          afterText: ''
        })
        setRewriteOriginalText(nextText)
      }
      return
    }

    if (rewriteSourceView === 'review') {
      const beforeResult = state.reviewResult
      setReviewBody(nextText)
      setView('review')
      const afterResult = await handleReviewAnalyze()
      if (afterResult) {
        setRewriteComparison({
          available: true,
          sourceView: rewriteSourceView,
          beforeText,
          afterText: nextText,
          beforeResult,
          afterResult
        })
        setRewriteComparisonTab('scores')
        setRewriteSelection({
          active: false,
          rowIndex: null,
          fullText: '',
          targetText: '',
          afterText: ''
        })
        setRewriteOriginalText(nextText)
      }
    }
  }

  const isRewriteReanalyzing =
    rewriteSourceView === 'analyzer'
      ? isInfoAnalyzing
      : rewriteSourceView === 'script'
        ? isScriptAnalyzing
        : rewriteSourceView === 'language'
          ? isLanguageAnalyzing
          : isReviewAnalyzing

  return (
    <main className='min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(236,242,255,0.9))] text-slate-900'>
      <div className='flex min-h-screen w-full flex-col px-4 py-4 sm:px-5 lg:px-6'>
        <header className='mb-4 flex flex-col gap-3 rounded-[1.25rem] border border-white/70 bg-white/65 px-4 py-3 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400'>
                AIR
              </p>
              <h1 className='truncate text-lg font-semibold tracking-tight text-slate-950 sm:text-xl'>
                {headerCopy[view].title}
              </h1>
            </div>
            <span className='shrink-0 rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-xs text-slate-600'>
              {openRouterApiKey ? 'OpenRouter 已配置' : 'OpenRouter 未配置'}
            </span>
          </div>
          <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={() => setView('analyzer')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === 'analyzer'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                信息评分器
              </button>
              <button
                type='button'
                onClick={() => setView('script')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === 'script'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                脚本实验室
              </button>
              <button
                type='button'
                onClick={() => setView('language')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === 'language'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                语言解剖台
              </button>
              <button
                type='button'
                onClick={() => setView('review')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === 'review'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                内容审查台
              </button>
              <button
                type='button'
                onClick={() => setView('settings')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  view === 'settings'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                设置页
              </button>
          </div>
        </header>

        {view === 'analyzer'
          ? (
            <AnalyzerSection
              infoInput={infoInput}
              setInfoInput={setInfoInput}
              handleInfoAnalyze={handleInfoAnalyze}
              isInfoAnalyzing={isInfoAnalyzing}
              infoError={infoError}
              infoMetricMeta={infoMetricMeta}
              infoScores={infoScores}
              infoReasons={infoReasons}
              infoSummary={infoSummary}
              infoProfile={infoProfile}
              infoUsage={infoUsage}
              openRewriteDrawer={openRewriteDrawer}
            />
            )
          : null}

        {view === 'review'
          ? (
            <ReviewSection
              reviewModeMeta={reviewModeMeta}
              reviewMode={reviewMode}
              setReviewMode={setReviewMode}
              reviewPlatform={reviewPlatform}
              setReviewPlatform={setReviewPlatform}
              reviewPlatforms={reviewPlatforms}
              reviewTitle={reviewTitle}
              setReviewTitle={setReviewTitle}
              reviewBody={reviewBody}
              setReviewBody={setReviewBody}
              reviewCover={reviewCover}
              setReviewCover={setReviewCover}
              handleReviewAnalyze={handleReviewAnalyze}
              isReviewAnalyzing={isReviewAnalyzing}
              reviewError={reviewError}
              reviewMetricMeta={reviewMetricMeta}
              reviewResult={reviewResult}
              reviewUsage={reviewUsage}
              openRewriteDrawer={openRewriteDrawer}
            />
            )
          : null}

        {view === 'language'
          ? (
            <LanguageSection
              languageTextType={languageTextType}
              setLanguageTextType={setLanguageTextType}
              languageTextTypes={languageTextTypes}
              languageTitle={languageTitle}
              setLanguageTitle={setLanguageTitle}
              languageBody={languageBody}
              setLanguageBody={setLanguageBody}
              handleLanguageAnalyze={handleLanguageAnalyze}
              isLanguageAnalyzing={isLanguageAnalyzing}
              languageError={languageError}
              languageMetricMeta={languageMetricMeta}
              languageResult={languageResult}
              languageUsage={languageUsage}
              openRewriteDrawer={openRewriteDrawer}
            />
            )
          : null}

        {view === 'script'
          ? (
            <ScriptSection
              scriptPlatform={scriptPlatform}
              setScriptPlatform={setScriptPlatform}
              scriptPlatforms={scriptPlatforms}
              scriptLengthOptions={scriptLengthOptions}
              scriptVideoLength={scriptVideoLength}
              setScriptVideoLength={setScriptVideoLength}
              scriptFormatOptions={scriptFormatOptions}
              scriptFormat={scriptFormat}
              setScriptFormat={setScriptFormat}
              scriptTitle={scriptTitle}
              setScriptTitle={setScriptTitle}
              scriptBody={scriptBody}
              setScriptBody={setScriptBody}
              handleScriptAnalyze={handleScriptAnalyze}
              isScriptAnalyzing={isScriptAnalyzing}
              scriptError={scriptError}
              scriptResult={scriptResult}
              scriptMetricMeta={scriptMetricMeta}
              scriptUsage={scriptUsage}
              openRewriteDrawer={openRewriteDrawer}
            />
            )
          : null}

        {view === 'settings'
          ? (
            <SettingsSection
              openRouterApiKey={openRouterApiKey}
              setOpenRouterApiKey={setOpenRouterApiKey}
              openRouterModelId={openRouterModelId}
              setOpenRouterModelId={setOpenRouterModelId}
              customSystemPrompt={customSystemPrompt}
              setCustomSystemPrompt={setCustomSystemPrompt}
              customTemperature={customTemperature}
              setCustomTemperature={setCustomTemperature}
              defaultEvaluationProfile={defaultEvaluationProfile}
              resetEvaluationSettings={resetEvaluationSettings}
              maskedApiKey={maskedApiKey}
            />
            )
          : null}

        {isRewriteOpen
          ? (
            <RewriteDrawer
              isOpen={isRewriteOpen}
              setIsOpen={setIsRewriteOpen}
              headerCopy={headerCopy}
              rewriteSourceView={rewriteSourceView}
              rewriteModesByView={rewriteModesByView}
              rewriteMode={rewriteMode}
              setRewriteMode={setRewriteMode}
              rewriteModeMeta={rewriteModeMeta}
              rewriteOriginalText={rewriteOriginalText}
              rewriteSummary={rewriteSummary}
              rewriteProblems={rewriteProblems}
              rewriteCustomInstruction={rewriteCustomInstruction}
              setRewriteCustomInstruction={setRewriteCustomInstruction}
              handleRewriteGenerate={handleRewriteGenerate}
              isRewriting={isRewriting}
              rewriteError={rewriteError}
              rewriteResult={rewriteResult}
              applyRewriteToInput={applyRewriteToInput}
              applyRewriteAndReanalyze={applyRewriteAndReanalyze}
              handleReanalyzeSelectedSegment={handleReanalyzeSelectedSegment}
              rewriteUsage={rewriteUsage}
              rewriteComparison={rewriteComparison}
              rewriteTextView={rewriteTextView}
              rewriteSelection={rewriteSelection}
              rewriteLocalReanalysis={rewriteLocalReanalysis}
              setRewriteTextView={setRewriteTextView}
              handleSelectRewriteSegment={handleSelectRewriteSegment}
              clearRewriteSelection={clearRewriteSelection}
              isRewriteReanalyzing={isRewriteReanalyzing}
            />
            )
          : null}
      </div>
    </main>
  )
}
