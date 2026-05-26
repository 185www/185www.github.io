const ExerciseEngine = {
  currentExercise: null,
  steps: null,
  currentStepIndex: 0,
  stepResults: [],
  exerciseResult: null,

  start(exerciseData) {
    this.currentExercise = exerciseData;
    const template = ExerciseTemplates[exerciseData.template];
    if (!template) {
      console.error(`Unknown template: ${exerciseData.template}`);
      return null;
    }
    this.steps = template.render(exerciseData.params);
    this.currentStepIndex = 0;
    this.stepResults = [];
    this.exerciseResult = null;
    return this.getCurrentStep();
  },

  getCurrentStep() {
    if (this.currentStepIndex >= this.steps.length) return null;
    const step = this.steps[this.currentStepIndex];
    return {
      index: this.currentStepIndex + 1,
      total: this.steps.length,
      prompt: step.prompt,
      type: step.type,
      options: step.options || undefined,
      hint: step.hint || undefined,
      exerciseTitle: this.currentExercise.title
    };
  },

  submitAnswer(answer) {
    const step = this.steps[this.currentStepIndex];
    if (!step) return { error: 'No active step' };

    const result = step.validate(answer);
    const passed = !!result;
    const expected = step.expected || '';

    this.stepResults.push({
      stepIndex: this.currentStepIndex,
      answer,
      passed,
      expected
    });

    if (!passed) {
      const ex = this.currentExercise;
      const steps = this.steps;
      const results = this.stepResults;
      const failedIdx = this.currentStepIndex;
      this.currentExercise = null;
      this.steps = null;
      this.currentStepIndex = 0;
      this.stepResults = [];
      this.exerciseResult = {
        type: ex?.template || 'unknown',
        title: ex?.title || '',
        passed: false,
        failedStep: failedIdx + 1,
        totalSteps: steps?.length || 0,
        stepResults: results,
        failedAnswer: answer,
        expectedAnswer: expected
      };
      return {
        status: 'failed',
        result: this.exerciseResult
      };
    }

    this.currentStepIndex++;

    if (this.currentStepIndex >= this.steps.length) {
      const exerciseCopy = this.currentExercise;
      const stepsCopy = this.stepResults;
      this.currentExercise = null;
      this.steps = null;
      this.exerciseResult = {
        type: exerciseCopy.template,
        title: exerciseCopy.title,
        passed: true,
        totalSteps: stepsCopy.length,
        stepResults: stepsCopy
      };
      this.currentStepIndex = 0;
      this.stepResults = [];
      return {
        status: 'passed',
        result: this.exerciseResult
      };
    }

    return {
      status: 'continue',
      nextStep: this.getCurrentStep()
    };
  },

  getExerciseResult() {
    return this.exerciseResult;
  },

  reset() {
    this.currentExercise = null;
    this.steps = null;
    this.currentStepIndex = 0;
    this.stepResults = [];
    this.exerciseResult = null;
  }
};
