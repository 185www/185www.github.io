const ExerciseTemplates = {
  'redox-reasoning': {
    name: '氧化还原推理',
    render(params) {
      const steps = [];

      if (params.substances) {
        steps.push({
          id: 1,
          prompt: `标出下列物质中各元素的化合价：\n${params.substances.map(s => s.formula).join(' + ')} → ?`,
          type: 'mark-valence',
          substances: params.substances,
          validate(input) {
            return Verifier.valance(input, params.substances.reduce((acc, s) => {
              acc[s.key] = s.valences;
              return acc;
            }, {}));
          },
          reasoningText: params.reasoning?.[0] || ''
        });
      }

      if (params.identifyOptions) {
        steps.push({
          id: steps.length + 1,
          prompt: params.identifyPrompt || '根据化合价变化，判断哪个物质是氧化剂（得电子、化合价降低），哪个是还原剂（失电子、化合价升高）？',
          type: 'choice',
          options: params.identifyOptions,
          validate(input) {
            return Verifier.choice(input, params.identifyOptions, params.identifyCorrectIndex);
          },
          reasoningText: params.reasoning?.[1] || ''
        });
      }

      if (params.priorityItems) {
        steps.push({
          id: steps.length + 1,
          prompt: params.priorityPrompt || '体系中存在多个还原性物质时，需要判断优先顺序。请按还原性从强到弱排序（输入序号，用逗号分隔）',
          type: 'rank-items',
          items: params.priorityItems,
          hint: params.priorityHint || '还原性强的先被氧化',
          validate(input) {
            const parsed = (input || '').trim().split(/[,，\s]+/).map(s => parseInt(s, 10));
            return Verifier.rank(parsed, params.priorityOrder);
          },
          reasoningText: params.reasoning?.[2] || ''
        });
      }

      if (params.semiPrompt) {
        steps.push({
          id: steps.length + 1,
          prompt: params.semiPrompt,
          type: 'fill-blank',
          hint: params.semiHint || '',
          validate(input) {
            return Verifier.fillBlank(input, params.semiAnswer, { fuzzy: true });
          },
          reasoningText: params.reasoning?.[3] || ''
        });
      }

      if (params.finalEquation) {
        steps.push({
          id: steps.length + 1,
          prompt: '写出完整的配平化学方程式（用 → 连接，反应物在左，生成物在右）',
          type: 'construct-equation',
          hint: params.finalHint || '',
          validate(input) {
            return Verifier.construct(input, params.finalEquation);
          },
          reasoningText: params.reasoning?.[params.reasoning ? params.reasoning.length - 1 : 0] || ''
        });
      }

      return steps;
    }
  },

  'concept-construction': {
    name: '概念建构',
    render(params) {
      const steps = [];

      if (params.cases && params.caseCommonality) {
        steps.push({
          id: 1,
          prompt: `分析以下案例，找出它们的共同特征：\n${params.cases.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n这些案例的共同点是：`,
          type: 'multi-choice',
          options: params.caseOptions,
          validate(input) {
            return Verifier.multiChoice(input, params.caseCorrectIndices);
          },
          reasoningText: params.reasoning?.[0] || `共同特征：${params.caseCommonality}`
        });
      }

      if (params.definitionKeyTerms) {
        steps.push({
          id: steps.length + 1,
          prompt: `根据以上共同特征，给出"${params.conceptName}"的完整定义`,
          type: 'fill-blank',
          hint: params.definitionHint || '',
          validate(input) {
            return Verifier.keyTerms(input, params.definitionKeyTerms);
          },
          reasoningText: params.reasoning?.[1] || `完整的定义：${params.fullDefinition}`
        });
      }

      if (params.boundaryItems) {
        steps.push({
          id: steps.length + 1,
          prompt: '以下哪些属于该概念的范畴？（可多选）',
          type: 'multi-choice',
          options: params.boundaryItems,
          validate(input) {
            return Verifier.multiChoice(input, params.boundaryCorrectIndices);
          },
          reasoningText: params.reasoning?.[2] || ''
        });
      }

      if (params.explainPrompt) {
        steps.push({
          id: steps.length + 1,
          prompt: params.explainPrompt,
          type: 'fill-blank',
          hint: params.explainHint || '',
          validate(input) {
            return Verifier.keyTerms(input, params.explainKeyTerms);
          },
          reasoningText: params.reasoning?.[3] || ''
        });
      }

      return steps;
    }
  },

  'comparison-reasoning': {
    name: '比较推理',
    render(params) {
      const steps = [];

      if (params.description) {
        steps.push({
          id: 1,
          prompt: `以下描述对应的是哪种物质？\n"${params.description}"\n\n这是 ${params.conceptA} 还是 ${params.conceptB}？`,
          type: 'choice',
          options: [params.conceptA, params.conceptB],
          validate(input) {
            return Verifier.choice(input, [params.conceptA, params.conceptB], params.identifyCorrectIndex);
          },
          reasoningText: params.reasoning?.[0] || ''
        });
      }

      if (params.excludePrompt) {
        steps.push({
          id: steps.length + 1,
          prompt: params.excludePrompt,
          type: 'fill-blank',
          hint: params.excludeHint || '',
          validate(input) {
            return Verifier.keyTerms(input, params.excludeKeyTerms);
          },
          reasoningText: params.reasoning?.[1] || ''
        });
      }

      if (params.differenceOptions) {
        steps.push({
          id: steps.length + 1,
          prompt: '两者最本质的区别是什么？',
          type: 'choice',
          options: params.differenceOptions,
          validate(input) {
            return Verifier.choice(input, params.differenceOptions, params.differenceCorrectIndex);
          },
          reasoningText: params.reasoning?.[2] || ''
        });
      }

      if (params.scenarioPrompt) {
        steps.push({
          id: steps.length + 1,
          prompt: params.scenarioPrompt,
          type: 'choice',
          options: params.scenarioOptions,
          validate(input) {
            return Verifier.choice(input, params.scenarioOptions, params.scenarioCorrectIndex);
          },
          reasoningText: params.reasoning?.[3] || ''
        });
      }

      return steps;
    }
  },

  'experimental-reasoning': {
    name: '实验推理',
    render(params) {
      const steps = [];

      if (params.principleOptions) {
        steps.push({
          id: 1,
          prompt: `实验目的：${params.goal}\n完成该实验需要利用什么化学原理？`,
          type: 'choice',
          options: params.principleOptions,
          validate(input) {
            return Verifier.choice(input, params.principleOptions, params.principleCorrectIndex);
          },
          reasoningText: params.reasoning?.[0] || ''
        });
      }

      if (params.keyStepItems) {
        steps.push({
          id: steps.length + 1,
          prompt: '以下哪些操作是该实验必需的？（可多选）',
          type: 'multi-choice',
          options: params.keyStepItems,
          validate(input) {
            return Verifier.multiChoice(input, params.keyStepCorrectIndices);
          },
          reasoningText: params.reasoning?.[1] || ''
        });
      }

      if (params.orderItems) {
        steps.push({
          id: steps.length + 1,
          prompt: params.orderPrompt || '将所选步骤按正确的操作顺序排列（输入序号，用逗号分隔）',
          type: 'rank-items',
          items: params.orderItems,
          hint: params.orderHint || '',
          validate(input) {
            const parsed = (input || '').trim().split(/[,，\s]+/).map(s => parseInt(s, 10));
            return Verifier.rank(parsed, params.orderCorrect);
          },
          reasoningText: params.reasoning?.[2] || ''
        });
      }

      if (params.consequenceOptions) {
        steps.push({
          id: steps.length + 1,
          prompt: params.consequencePrompt || '如果顺序出错（比如先做了某步），会造成什么后果？',
          type: 'choice',
          options: params.consequenceOptions,
          validate(input) {
            return Verifier.choice(input, params.consequenceOptions, params.consequenceCorrectIndex);
          },
          reasoningText: params.reasoning?.[3] || ''
        });
      }

      return steps;
    }
  },

  'error-analysis': {
    name: '错误分析',
    render(params) {
      const steps = [];

      if (params.errorOptions) {
        steps.push({
          id: 1,
          prompt: `以下陈述中有错误：\n"${params.statement}"\n\n错误出在哪里？`,
          type: 'choice',
          options: params.errorOptions,
          validate(input) {
            return Verifier.choice(input, params.errorOptions, params.errorCorrectIndex);
          },
          reasoningText: params.reasoning?.[0] || ''
        });
      }

      if (params.principleKeyTerms) {
        steps.push({
          id: steps.length + 1,
          prompt: '从化学原理层面解释：为什么这是错的？哪个概念被误解了？',
          type: 'fill-blank',
          hint: params.principleHint || '',
          validate(input) {
            return Verifier.keyTerms(input, params.principleKeyTerms);
          },
          reasoningText: params.reasoning?.[1] || ''
        });
      }

      if (params.correctVersion) {
        steps.push({
          id: steps.length + 1,
          prompt: '写出正确的版本',
          type: 'fill-blank',
          hint: params.finalHint || '',
          validate(input) {
            return Verifier.fillBlank(input, params.correctVersion, { fuzzy: true });
          },
          reasoningText: params.reasoning?.[2] || ''
        });
      }

      return steps;
    }
  }
};
