const ExerciseEngine = {
  currentExercise: null,
  steps: null,
  currentStepIndex: 0,
  stepResults: [],
  showingReasoning: false,
  currentReasoningText: '',

  start(exerciseData) {
    const template = ExerciseTemplates[exerciseData.template];
    if (!template) {
      console.error('Unknown template:', exerciseData.template);
      return null;
    }
    this.currentExercise = exerciseData;
    this.steps = template.render(exerciseData.params);
    this.currentStepIndex = 0;
    this.stepResults = [];
    this.showingReasoning = false;
    this.currentReasoningText = '';
    return this.getCurrentStep();
  },

  getCurrentStep() {
    if (this.currentStepIndex >= this.steps.length) return null;
    const step = this.steps[this.currentStepIndex];
    const result = {
      index: this.currentStepIndex + 1,
      total: this.steps.length,
      prompt: step.prompt,
      type: step.type,
      options: step.options || undefined,
      items: step.items || undefined,
      substances: step.substances || undefined,
      hint: step.hint || undefined,
      exerciseTitle: this.currentExercise.title,
      showingReasoning: this.showingReasoning,
      reasoningText: this.currentReasoningText
    };
    return result;
  },

  submitAnswer(answer) {
    const step = this.steps[this.currentStepIndex];
    if (!step) return { error: 'No active step' };

    const passed = step.validate(answer);
    let expected = '';
    if (step.type === 'mark-valence') {
      expected = '化合价标注正确';
    } else if (step.type === 'rank-items') {
      expected = '排序正确';
    } else if (step.type === 'construct-equation') {
      expected = '方程式正确';
    } else if (step.options) {
      const idx = step.options.findIndex(o => o === (step.expected || ''));
      expected = step.expected || '';
    }

    this.stepResults.push({
      stepIndex: this.currentStepIndex,
      type: step.type,
      prompt: step.prompt,
      answer,
      passed,
      reasoningText: passed ? '' : (step.reasoningText || '')
    });

    if (!passed) {
      this.showingReasoning = true;
      this.currentReasoningText = step.reasoningText || '你的推理有误。正确的推理路径如上所示。';
      return {
        status: 'wrong',
        currentStep: this.getCurrentStep()
      };
    }

    this.showingReasoning = false;
    this.currentReasoningText = '';
    this.currentStepIndex++;

    if (this.currentStepIndex >= this.steps.length) {
      return {
        status: 'complete',
        result: this._buildResult()
      };
    }

    return {
      status: 'correct',
      nextStep: this.getCurrentStep()
    };
  },

  continueAfterWrong() {
    this.showingReasoning = false;
    this.currentReasoningText = '';
    this.currentStepIndex++;

    if (this.currentStepIndex >= this.steps.length) {
      return {
        status: 'complete',
        result: this._buildResult()
      };
    }

    return {
      status: 'continue',
      nextStep: this.getCurrentStep()
    };
  },

  _buildResult() {
    const anyFailed = this.stepResults.some(r => !r.passed);
    const failedSteps = this.stepResults
      .filter(r => !r.passed)
      .map(r => r.stepIndex + 1);

    return {
      type: this.currentExercise.template,
      title: this.currentExercise.title,
      passed: !anyFailed,
      totalSteps: this.steps.length,
      stepResults: this.stepResults,
      failedSteps,
      reasoningTrace: this.stepResults
        .filter(r => r.reasoningText)
        .map(r => ({ step: r.stepIndex + 1, reasoning: r.reasoningText }))
    };
  },

  getResult() {
    return this._buildResult();
  },

  reset() {
    this.currentExercise = null;
    this.steps = null;
    this.currentStepIndex = 0;
    this.stepResults = [];
    this.showingReasoning = false;
    this.currentReasoningText = '';
  }
};
