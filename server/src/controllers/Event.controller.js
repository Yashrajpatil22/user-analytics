import Event from "../models/Event.model.js";

const createEvent = async (req, res, next) => {
  try {
    const {
      session_id,
      event_type,
      page_url,
      timestamp,
      x,
      y,
      viewport_width,
      viewport_height,
      scroll_x,
      scroll_y,
    } = req.body;

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
    if (event_type === "click") {
      if (
        !Number.isFinite(viewport_width) ||
        viewport_width < 1 ||
        !Number.isFinite(viewport_height) ||
        viewport_height < 1 ||
        !Number.isFinite(scroll_x) ||
        scroll_x < 0 ||
        !Number.isFinite(scroll_y) ||
        scroll_y < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Click events require valid viewport dimensions and scroll positions",
        });
      }
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
      eventData.viewport_width = viewport_width;
      eventData.viewport_height = viewport_height;
      eventData.scroll_x = scroll_x;
      eventData.scroll_y = scroll_y;
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

const getPageClicks = async (req, res, next) => {
  try {
    const { pageUrl } = req.query;

    if (!pageUrl || !pageUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "pageUrl query parameter is required",
      });
    }

    const clicks = await Event.find({
      page_url: pageUrl,
      event_type: "click",
    })
      .select(
        "session_id page_url timestamp x y viewport_width viewport_height scroll_x scroll_y",
      )
      .sort({ timestamp: 1 });

    return res.status(200).json({
      success: true,
      count: clicks.length,
      data: clicks,
    });
  } catch (error) {
    next(error);
  }
};

const getPageUrls = async (req, res, next) => {
  try {
    const pages = await Event.distinct("page_url", {
      event_type: "click",
    });

    return res.status(200).json({
      success: true,
      count: pages.length,
      data: pages.sort(),
    });
  } catch (error) {
    next(error);
  }
};

export { createEvent, getPageClicks, getPageUrls };