const ExerciseTemplates = {
  'equation-builder': {
    name: '方程式构建',
    render(params) {
      return [
        {
          id: 1,
          prompt: `写出反应物（${params.description || ''}）`,
          type: 'fill-blank',
          hint: params.hints?.[0] || '',
          validate(input) {
            return Verifier.fillBlank(input, params.reactants, { fuzzy: true });
          },
          expected: params.reactants
        },
        {
          id: 2,
          prompt: '判断该反应的类型',
          type: 'choice',
          options: params.reactionType.options,
          validate(input) {
            return Verifier.choice(input, params.reactionType.options, params.reactionType.correctIndex);
          },
          expected: params.reactionType.options[params.reactionType.correctIndex]
        },
        {
          id: 3,
          prompt: '写出反应产物',
          type: 'fill-blank',
          hint: params.hints?.[1] || '',
          validate(input) {
            return Verifier.fillBlank(input, params.products, { fuzzy: true });
          },
          expected: params.products
        },
        {
          id: 4,
          prompt: '配平方程式，输入各物质的系数（用逗号分隔）',
          type: 'fill-blank',
          hint: params.hints?.[2] || '',
          validate(input) {
            return Verifier.coefficients(input, params.coefficients);
          },
          expected: params.coefficients.join(', ')
        }
      ];
    }
  },

  'concept-mapper': {
    name: '概念映射',
    render(params) {
      const steps = [];
      steps.push({
        id: 1,
        prompt: `补全核心定义：${params.definition.blank}`,
        type: 'fill-blank',
        validate(input) {
          return Verifier.fillBlank(input, params.definition.answer, { fuzzy: true });
        },
        expected: params.definition.answer
      });
      if (params.attributes) {
        steps.push({
          id: 2,
          prompt: '判断以下哪些描述是正确的？（可多选）',
          type: 'multi-choice',
          options: params.attributes.items,
          validate(input) {
            return Verifier.multiChoice(input, params.attributes.correctIndices);
          },
          expected: params.attributes.correctIndices.map(i => params.attributes.items[i]).join('、')
        });
      }
      if (params.boundaries) {
        steps.push({
          id: 3,
          prompt: '以下哪些属于该概念的范畴？（可多选）',
          type: 'multi-choice',
          options: params.boundaries.items,
          validate(input) {
            return Verifier.multiChoice(input, params.boundaries.correctIndices);
          },
          expected: params.boundaries.correctIndices.map(i => params.boundaries.items[i]).join('、')
        });
      }
      return steps;
    }
  },

  comparator: {
    name: '对比辨析',
    render(params) {
      return [
        {
          id: 1,
          prompt: `选出 ${params.conceptA} 的正确特征（可多选）`,
          type: 'multi-choice',
          options: params.featuresA.items,
          validate(input) {
            return Verifier.multiChoice(input, params.featuresA.correctIndices);
          },
          expected: params.featuresA.correctIndices.map(i => params.featuresA.items[i]).join('、')
        },
        {
          id: 2,
          prompt: `选出 ${params.conceptB} 的正确特征（可多选）`,
          type: 'multi-choice',
          options: params.featuresB.items,
          validate(input) {
            return Verifier.multiChoice(input, params.featuresB.correctIndices);
          },
          expected: params.featuresB.correctIndices.map(i => params.featuresB.items[i]).join('、')
        },
        {
          id: 3,
          prompt: `两者最本质的区别是什么？`,
          type: 'choice',
          options: params.difference.options,
          validate(input) {
            return Verifier.choice(input, params.difference.options, params.difference.correctIndex);
          },
          expected: params.difference.options[params.difference.correctIndex]
        }
      ];
    }
  },

  'procedure-sequencer': {
    name: '流程排序',
    render(params) {
      return [
        {
          id: 1,
          prompt: `从以下选项中选出该流程包含的正确步骤（可多选）`,
          type: 'multi-choice',
          options: params.steps.items,
          validate(input) {
            return Verifier.multiChoice(input, params.steps.correctIndices);
          },
          expected: `${params.steps.correctIndices.length}个步骤`
        },
        {
          id: 2,
          prompt: '将上述正确步骤按正确顺序排列（输入序号，用逗号分隔）',
          type: 'fill-blank',
          hint: '按操作先后顺序排列',
          validate(input) {
            const seq = (input || '').trim().split(/[,，\s]+/).map(s => parseInt(s, 10));
            return Verifier.sequence(seq, params.steps.correctOrder);
          },
          expected: params.steps.correctOrder.join(' → ')
        },
        {
          id: 3,
          prompt: '以下哪些是该操作的关键注意事项？（可多选）',
          type: 'multi-choice',
          options: params.notes.items,
          validate(input) {
            return Verifier.multiChoice(input, params.notes.correctIndices);
          },
          expected: params.notes.correctIndices.map(i => params.notes.items[i]).join('、')
        }
      ];
    }
  },

  'error-detector': {
    name: '错误诊断',
    render(params) {
      return [
        {
          id: 1,
          prompt: `以下陈述中有错误：\n"${params.statement}"\n错误出在哪里？`,
          type: 'choice',
          options: params.errorLocation.options,
          validate(input) {
            return Verifier.choice(input, params.errorLocation.options, params.errorLocation.correctIndex);
          },
          expected: params.errorLocation.options[params.errorLocation.correctIndex]
        },
        {
          id: 2,
          prompt: '错误的根本原因是什么？',
          type: 'choice',
          options: params.explanation.options,
          validate(input) {
            return Verifier.choice(input, params.explanation.options, params.explanation.correctIndex);
          },
          expected: params.explanation.options[params.explanation.correctIndex]
        },
        {
          id: 3,
          prompt: '写出正确的版本',
          type: 'fill-blank',
          hint: params.hint || '',
          validate(input) {
            return Verifier.fillBlank(input, params.correctVersion, { fuzzy: true });
          },
          expected: params.correctVersion
        }
      ];
    }
  }
};
