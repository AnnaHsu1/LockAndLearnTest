const express = require('express');
const router = express.Router();
const Timeframe = require('../schema/timeframeSchema.js');

// Handle timeframe creation
router.post('/addtimeframe', async (req, res) => {
  try {
    // Extract user data from the request body
    // console.log(req.body);
    const { childId, day, startTime, endTime } = req.body;
    // console.log(ChildId, Day, StartTime, EndTime);

    // console.log(childId, day, startTime, endTime);

    startHour = parseInt(startTime.substring(0, 2));
    startMin = parseInt(startTime.substring(3, 5));
    endHour = parseInt(endTime.substring(0, 2));
    endMin = parseInt(endTime.substring(3, 5));
    // console.log(startHour, startMin, endHour, endMin);

    // Input validations
    if (!childId || !day || !startTime || !endTime) {
      return res.status(400).json({ msg: 'All fields must be filled.' });
    }

    if (startHour > endHour || (startHour === endHour && startMin > endMin)) {
      return res.status(400).json({ msg: 'Start time must be before end time.' });
    }

    const newTimeframe = new Timeframe({
      childId,
      day,
      startTime,
      endTime,
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

module.exports = router;
