const express = require('express');
const router = express.Router();
const Timeframe = require('../schema/timeframeSchema.js');

// Handle timeframe creation
router.post('/addtimeframe', async (req, res) => {
  try {
    // Extract user data from the request body
    const { childId, day, startTime, endTime, subject } = req.body;
    startHour = startTime.substring(0, 2);
    startMin = startTime.substring(3, 5);
    endHour = endTime.substring(0, 2);
    endMin = endTime.substring(3, 5);

    // Input validations
    if (!childId || !day || !startHour || !startMin || !endHour || !endMin) {
      return res.status(400).json({ msg: 'All fields must be filled.' });
    }

    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
      return res.status(400).json({ msg: 'Hour must be between 00 and 23.' });
    }

    if (startMin < 0 || startMin > 59 || endMin < 0 || endMin > 59) {
      return res.status(400).json({ msg: 'Minute must be between 00 and 59.' });
    }

    if (startHour > endHour || (startHour === endHour && startMin > endMin)) {
      return res.status(400).json({ msg: 'Start time must be before end time.' });
    }

    const integerHoursCheck = new RegExp('^[0-9]+$');
    if (!integerHoursCheck.test(startHour) || !integerHoursCheck.test(endHour)) {
      return res.status(400).json({ msg: 'Hour must be an integer between 00 and 23.' });
    }

    const integerMinsCheck = new RegExp('^[0-5][0-9]$');
    if (!integerMinsCheck.test(startMin) || !integerMinsCheck.test(endMin)) {
      return res.status(400).json({ msg: 'Minute must be an integer between 00 and 59.' });
    }

    const newTimeframe = new Timeframe({
      childId,
      day,
      startTime,
      endTime,
      subject,
    });
    await newTimeframe.save();

    // Respond with the newly created user
    res.status(201).json({ message: 'Successfully added timeframe' });
  } catch (error) {
    // Handle errors if createUser function fails
    console.error('Error adding timeframe:', error);
    res.status(500).json({ error: 'Unable to add timeframe' });
  }
});

// Handle timeframe retrieval
router.get('/gettimeframes/:childId', async (req, res) => {
  try {
    const childId = req.params.childId;
    const timeframes = await Timeframe.find({ childId: childId });
    res.status(200).json(timeframes);
  } catch (error) {
    console.error('Error getting timeframes:', error);
    res.status(500).json({ error: 'Unable to get timeframes' });
  }
});

// Handle timeframe update for isActive (switching on/off)
router.put('/updatetimeframe', async (req, res) => {
  try {
    // Extract switch data from the request body
    const { timeframeIds, switchesStatus } = req.body;

    // Input validations
    if (!timeframeIds) {
      return res.status(400).json({ msg: 'Timeframe ID must be provided.' });
    }
    if (!switchesStatus) {
      return res.status(400).json({ msg: 'Switch status must be provided.' });
    }

    // Update the isActive field of the timeframe
    timeframeIds.forEach(async (timeframeId, index) => {
      await Timeframe.updateOne({ _id: timeframeId }, { isActive: switchesStatus[index] });
    });

    // Respond with the updated timeframe switch status
    res.status(200).json({ message: 'Successfully updated timeframe' });
  } catch (error) {
    // Handle errors if createUser function fails
    console.error('Error updating timeframe:', error);
    res.status(500).json({ msg: 'Unable to update timeframe' });
  }
});

// Handle timeframe deletion
router.delete('/deletetimeframe/:timeframeId', async (req, res) => {
  try {
    // Extract timeframe data from the request body
    const timeframeId = req.params.timeframeId;
    // Input validations
    if (!timeframeId) {
      return res.status(400).json({ msg: 'Timeframe ID must be provided.' });
    }

    // Delete the timeframe
    await Timeframe.deleteOne({ _id: timeframeId });

    // Respond with the deleted timeframe
    res.status(200).json({ message: 'Successfully deleted timeframe' });
  } catch (error) {
    // Handle errors if createUser function fails
    console.error('Error deleting timeframe:', error);
    res.status(500).json({ msg: 'Unable to delete timeframe' });
  }
});

// Handle timeframe update for edit time periods
router.put('/updateEditTimeframe', async (req, res) => {
  const {
    timeframeIds,
    editStartHours,
    editStartMinutes,
    editEndHours,
    editEndMinutes,
    editSubjects,
  } = req.body;

  try {
    for (let i = 0; i < timeframeIds.length; i++) {
      const timeframeId = timeframeIds[i];
      const editStartHour = editStartHours[i];
      const editStartMinute = editStartMinutes[i];
      const editEndHour = editEndHours[i];
      const editEndMinute = editEndMinutes[i];
      const editSubject = editSubjects[i];

      // Input validations
      if (!timeframeId) {
        return res.status(400).json({ msg: 'Timeframe ID must be provided.' });
      }
      if (!editStartHour || !editStartMinute || !editEndHour || !editEndMinute) {
        return res.status(400).json({ msg: 'All fields must be filled.' });
      }
      if (editStartHour < 0 || editStartHour > 23 || editEndHour < 0 || editEndHour > 23) {
        return res.status(400).json({ msg: 'Hour must be between 00 and 23.' });
      }
      if (editStartMinute < 0 || editStartMinute > 59 || editEndMinute < 0 || editEndMinute > 59) {
        return res.status(400).json({ msg: 'Minute must be between 00 and 59.' });
      }
      if (
        editStartHour > editEndHour ||
        (editStartHour === editEndHour && editStartMinute > editEndMinute)
      ) {
        return res.status(400).json({ msg: 'Start time must be before end time.' });
      }
      const integerHoursCheck = new RegExp('^[0-9]+$');
      if (!integerHoursCheck.test(editStartHour) || !integerHoursCheck.test(editEndHour)) {
        return res.status(400).json({ msg: 'Hour must be an integer between 00 and 23.' });
      }
      const integerMinsCheck = new RegExp('^[0-5][0-9]$');
      if (!integerMinsCheck.test(editStartMinute) || !integerMinsCheck.test(editEndMinute)) {
        return res.status(400).json({ msg: 'Minute must be an integer between 00 and 59.' });
      }

      // Update the timeframe
      await Timeframe.updateOne(
        { _id: timeframeId },
        {
          startTime: `${editStartHour}:${editStartMinute}`,
          endTime: `${editEndHour}:${editEndMinute}`,
          subject: editSubject,
        }
      );
    }
    // Respond with the updated timeframe
    res.status(200).json({ message: 'Successfully updated timeframe' });
  } catch (error) {
    // Handle errors if createUser function fails
    console.error('Error updating timeframe:', error);
    res.status(500).json({ msg: 'Unable to update timeframe' });
  }
});

module.exports = router;
