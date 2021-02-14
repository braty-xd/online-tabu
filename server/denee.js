const { getEventListeners, EventEmitter } = require("events");

{
  const ee = new EventEmitter();
  const listener = () => console.log("Events are fun");
  ee.on("foo", listener);
  getEventListeners(ee, "foo"); // [listener]
}
{
  const et = new EventTarget();
  const listener = () => console.log("Events are fun");
  et.addEventListener("foo", listener);
  getEventListeners(et, "foo"); // [listener]
}
