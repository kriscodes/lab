/** @file Lets visitors follow a question in one of four everyday areas of the web. */
'use client';

import { useState } from 'react';
import { StudySymbol, type StudyTopicName } from './study-symbol';
import styles from './studies.module.css';

const studyTopics = [
  {
    name: 'loading',
    label: 'Loading',
    introduction: ['Less waiting.', 'More doing.'],
    question: 'Could the first page arrive before the whole file?',
  },
  {
    name: 'motion',
    label: 'Motion',
    introduction: ['Movement', 'with a purpose.'],
    question: 'When does movement help us understand what changed?',
  },
  {
    name: 'accessibility',
    label: 'Accessibility',
    introduction: ['More people.', 'Fewer barriers.'],
    question: 'Could every interaction feel good without a mouse?',
  },
  {
    name: 'efficiency',
    label: 'Efficiency',
    introduction: ['Do more with', 'a little less.'],
    question: 'Could the same experience ask less of your device?',
  },
] as const;

/** Shows one question at a time, with native buttons and a polite screen-reader update. */
export function StudyTopics() {
  const [selectedTopicName, setSelectedTopicName] = useState<StudyTopicName>('loading');
  const selectedTopic =
    studyTopics.find((topic) => topic.name === selectedTopicName) ?? studyTopics[0];

  return (
    <section className={styles.topics} aria-label="Areas to explore">
      <p className={styles.kicker}>A FEW PLACES TO LOOK</p>
      <div className={styles.topicGrid} role="group" aria-label="Choose a question to explore">
        {studyTopics.map((topic) => (
          <button
            key={topic.name}
            type="button"
            className={styles.topicButton}
            aria-pressed={topic.name === selectedTopicName}
            aria-controls="studies-question"
            onClick={() => setSelectedTopicName(topic.name)}
          >
            <span className={styles.topicSymbol}>
              <StudySymbol topic={topic.name} />
            </span>
            <span className={styles.topicName}>{topic.label}</span>
            <span className={styles.topicIntroduction}>
              {topic.introduction[0]}
              <br />
              {topic.introduction[1]}
            </span>
          </button>
        ))}
      </div>
      <div id="studies-question" className={styles.question} aria-live="polite" aria-atomic="true">
        <p className={styles.questionLabel}>
          A QUESTION
          <br />
          IN {selectedTopic.label.toUpperCase()}
        </p>
        <p className={styles.questionText}>{selectedTopic.question}</p>
      </div>
    </section>
  );
}
