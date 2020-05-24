const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const deptReminderSchema = new Schema({
  amountOfMoney: {
    type: Schema.Types.Number,
    require: true,
  },
  content: {
    type: Schema.Types.String,
    require: true,
  },
  stkRemind: {
      type: Schema.Types.String,
      required: true
  },
  stkWasRemined:{
      type: Schema.Types.String,
      required: true
  }  
});

module.exports = mongoose.model("DeptReminder", deptReminderSchema);
