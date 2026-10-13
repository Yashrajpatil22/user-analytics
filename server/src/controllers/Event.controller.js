import Event from "../models/Event.model.js";

const createEvent = async (req, res, next) => {
  try {
    const { session_id, event_type, page_url, timestamp, x, y } = req.body;

    if (!session_id || !event_type || !page_url || !timestamp) {
      return res.status(400).json({
        success: false,
        message: "session_id, event_type, page_url, and timestamp are required",
      });
    }

    if (!["page_view", "click"].includes(event_type)) {
      return res.status(400).json({
        success: false,
        message: "event_type must be page_view or click",
      });
    }

    const eventTimestamp = new Date(timestamp);

    if (Number.isNaN(eventTimestamp.getTime())) {
      return res.status(400).json({
        success: false,
        message: "timestamp must be a valid date",
      });
    }

    if (
      event_type === "click" &&
      (
        typeof x !== "number" ||
        typeof y !== "number" ||
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        x < 0 ||
        y < 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Click events require non-negative numeric x and y coordinates",
      });
    }

    const eventData = {
      session_id,
      event_type,
      page_url,
      timestamp: eventTimestamp,
    };

    if (event_type === "click") {
      eventData.x = x;
      eventData.y = y;
    }

    const event = await Event.create(eventData);

    return res.status(201).json({
      success: true,
      message: "Event recorded successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export { createEvent };