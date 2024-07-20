import { defineEventHandler, H3Event } from "h3";
import { ControlCrmState } from "../../../core/automation/control-crm-state";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const res =await ControlCrmState.run();
    return new Response(JSON.stringify({res, notificationTotal: res.length}), {
      status: 200,

    });
  } catch (error) {
    console.log({error});
    return new Response(JSON.stringify({error}), {
      status: 500,

    });
  }
});
