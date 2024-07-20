import { Connector } from '../..//utils/connector';
import { APIService } from './../../API.service';
import { defineEventHandler, H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const api = new APIService();
  const res = await api.ListEvolinciteArticles();
  return new Response(JSON.stringify({
    data: res.items,
  }), {
    status: 200,
  });
})
