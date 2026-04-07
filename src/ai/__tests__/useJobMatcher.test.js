import assert from 'node:assert';
import { test, describe } from 'node:test';
import { generateVisualization, generateLearningTimeline, formatMatchReport, preparePDFData } from '../useJobMatcher.js';

describe('useJobMatcher', () => {
  test('generateVisualization - high match', () => {
    const analysis = {
      matchScore: 90,
      matchLevel: 'high',
      matchingSkills: [1, 2, 3],
      missingSkills: [
        { skill: 'S1', importance: 'critical' },
        { skill: 'S2', importance: 'nice-to-have' }
      ]
    };
    const result = generateVisualization(analysis);
    assert.strictEqual(result.scoreGauge.score, 90);
    assert.strictEqual(result.scoreGauge.level, 'high');
    assert.strictEqual(result.scoreGauge.color, '#48bb78');
    assert.strictEqual(result.skillsDistribution.matching, 3);
    assert.strictEqual(result.skillsDistribution.missing, 2);
    assert.strictEqual(result.skillsDistribution.total, 5);
    assert.strictEqual(result.missingByImportance.critical, 1);
    assert.strictEqual(result.missingByImportance.niceToHave, 1);
    assert.strictEqual(result.missingByImportance.important, 0);
  });

  test('generateVisualization - medium match', () => {
    const analysis = {
      matchScore: 70,
      matchLevel: 'medium',
      matchingSkills: [],
      missingSkills: []
    };
    const result = generateVisualization(analysis);
    assert.strictEqual(result.scoreGauge.color, '#ed8936');
  });

  test('generateVisualization - low match', () => {
    const analysis = {
      matchScore: 40,
      matchLevel: 'low',
      matchingSkills: [],
      missingSkills: []
    };
    const result = generateVisualization(analysis);
    assert.strictEqual(result.scoreGauge.color, '#f56565');
  });

  test('generateLearningTimeline - all phases', () => {
    const learningPath = {
      immediate: ['Skill A'],
      shortTerm: ['Skill B'],
      longTerm: ['Skill C']
    };
    const result = generateLearningTimeline(learningPath);
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0].phase, '立即行动');
    assert.strictEqual(result[1].phase, '短期目标');
    assert.strictEqual(result[2].phase, '长期规划');
  });

  test('generateLearningTimeline - empty', () => {
    const learningPath = {};
    const result = generateLearningTimeline(learningPath);
    assert.strictEqual(result.length, 0);
  });

  test('formatMatchReport - basic content', () => {
    const analysis = {
      matchScore: 85,
      matchLevel: 'high',
      overallAssessment: 'Excellent candidate',
      matchingSkills: [],
      missingSkills: [],
      advantages: [],
      resumeOptimization: []
    };
    const result = formatMatchReport(analysis);
    assert.ok(result.includes('# 岗位匹配分析报告'));
    assert.ok(result.includes('85 分'));
    assert.ok(result.includes('Excellent candidate'));
  });

  test('preparePDFData - structure', () => {
    const analysis = {
      matchScore: 85,
      matchLevel: 'high',
      overallAssessment: 'Good',
      matchingSkills: [],
      missingSkills: [],
      advantages: [],
      learningPath: {},
      resumeOptimization: []
    };
    const result = preparePDFData(analysis);
    assert.strictEqual(result.title, '岗位匹配分析报告');
    assert.ok(Array.isArray(result.sections));
    assert.strictEqual(result.sections[0].type, 'score');
  });
});
