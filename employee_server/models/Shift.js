import mongoose from 'mongoose';

const BreakSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  type: {
    type: String,
    enum: ['tea break', 'lunch break', 'other'],
    default: 'other',
  },
});

const ShiftSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    startLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    endLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    breaks: { type: [BreakSchema], default: [] },
    notes: { type: String, default: '' },
    shiftHours: {type: String, default: ''}
  },
  { timestamps: true }
);

const Shift = mongoose.models.Shift || mongoose.model('Shift', ShiftSchema);

export default Shift;
