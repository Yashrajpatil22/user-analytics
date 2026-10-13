import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    session_id: {
      type: String,
      required: true,
      trim: true,
    },

    event_type: {
      type: String,
      required: true,
      enum: ["page_view", "click"],
    },

    page_url: {
      type: String,
      required: true,
      trim: true,
    },

    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },

    x: {
      type: Number,
      required: function () {
        return this.event_type === "click";
      },
      min: 0,
    },

    y: {
      type: Number,
      required: function () {
        return this.event_type === "click";
      },
      min: 0,
    },
    viewport_width: {
      type: Number,
      min: 1,
    },
    viewport_height: {
      type: Number,
      min: 1,
    },
    scroll_x: {
      type: Number,
      min: 0,
    },
    scroll_y: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.index({ session_id: 1, timestamp: 1 });
eventSchema.index({ page_url: 1, event_type: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
