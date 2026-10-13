import Event from "../models/Event.model.js";

const getSessions = async (req, res, next) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          total_events: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          session_id: "$_id",
          total_events: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};


const getSessionEvents = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId || !sessionId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const events = await Event.find({
      session_id: sessionId,
    }).sort({ timestamp: 1 });

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export { getSessions, getSessionEvents };
