// LockingSchedulePresentation.js

import React from 'react';

function LockingSchedulePresentation() {
  const styles = {
    lessonContainer: {
      fontFamily: 'Arial, sans-serif',
      width: '100vw',
      height: '100vh',
      borderRadius: '15px',
      backgroundColor: '#407BFF',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px'
    },
    lessonHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    endSessionButton: {
      backgroundColor: '#fff',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    lessonContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    startLearningButton: {
      backgroundColor: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '20px 0'
    },
    learningImage: {
      width: '80%',
      height: 'auto'
    }
  };

  return (
    <div style={styles.lessonContainer}>
      <div style={styles.lessonHeader}>
        <span>9:41</span>
        <button style={styles.endSessionButton}>End Session</button>
      </div>
      <div style={styles.lessonContent}>
        <h1>Lesson Schedule</h1>
        <h2>Math</h2>
        <h3>⏱️ 1h40</h3>
        <ul>
          <li>Additions</li>
          <li>Subtractions</li>
          <li>Quiz (30 questions)</li>
        </ul>
        <p>The quiz must be passed with a grade of 75% or higher</p>
        <button style={styles.startLearningButton}>Start Learning</button>
        <img src="path_to_your_image_here" alt="Learning Illustration" style={styles.learningImage} />
      </div>
    </div>
  );
}

export default LockingSchedulePresentation;

