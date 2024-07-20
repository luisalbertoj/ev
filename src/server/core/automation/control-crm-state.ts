import { system } from "../..//utils/system";
import { APIService, EvolinciteCrmAutomation, EvolinciteCrmNegotiation, EvolinciteNotification, EvolinciteNotificationPriority, EvolinciteRule, EvolinciteStates, GetEvolinciteCrmAutomationQuery, GetEvolinciteCrmNegotiationQuery } from "../../API.service";

const api = new APIService();

export const run = async () => {

  let promises = [];
  const automations = await getAutomation();
  promises = [];
  const automationIndex: { [key: string]: EvolinciteCrmAutomation } = {};
  for (const automation of automations.items) {
    if (automation?.rule == EvolinciteRule.CONTROL_CRM_STATES) {
      const crmStateId = automation.evolinciteCrmStateID;
      if (!crmStateId) {
        continue;
      }
      automationIndex[crmStateId] = automation;
      promises.push(getNegotiations(crmStateId));
    }
  }
  const negotiationsRes = (await Promise.all(promises));
  let negotiations: EvolinciteCrmNegotiation[] = [];
  for (const iterator of negotiationsRes) {
    negotiations = [
      ...negotiations,
      ...(iterator.items) as EvolinciteCrmNegotiation[],
    ];
  }
  promises = [];
  for (const negotiation of negotiations) {
    if (!negotiation?.evolinciteCrmStateID) {
      continue;
    }
  const automationConfig: any = system.parseJsonToObject(automationIndex[negotiation.evolinciteCrmStateID].setting ?? "{}");
    const negotiationDate = negotiation.updatedAt as string;
    console.log({
      automationConfig,
      date: new Date(new Date(negotiationDate) + automationConfig.days),
      date2: new Date(),
      comparation: compareDate(
        new Date(new Date(negotiationDate) + automationConfig.days),
        new Date(),
      )
    });

    if (
      !compareDate(
        new Date(new Date(negotiationDate) + automationConfig.days),
        new Date(),
      )
    ) {
      promises.push(createNotification(negotiation, automationConfig));
    }
  }
  return Promise.all(promises);
};

export const createNotification = async (
  negotiation: EvolinciteCrmNegotiation,
  automationConfig: any,
) => {
  const promises = [];
  console.log({negotiations: negotiation.name, automationConfig});
  for (const userId of automationConfig.users) {
    const input: Partial<EvolinciteNotification> = {
      evolinciteCompanyID: negotiation.evolinciteCompanyID,
      evolinciteUserID: userId,
      priority: EvolinciteNotificationPriority.HIGH,
      title: negotiation.name,
      content: automationConfig.description,
      state: EvolinciteStates.ACTIVE,
    };
    promises.push(
      api.CreateEvolinciteNotification(input),
    );
  }
  return await Promise.all(promises);
};

export const getAutomation = () => {
  return  api.ListEvolinciteCrmAutomations({
    state: { eq: EvolinciteStates.ACTIVE },
  })
};

export const getNegotiations = (crmStateId: string) => {
  return api.EvolinciteCrmNegotiationsByEvolinciteCrmStateIDAndCreatedAt(
    crmStateId,
    undefined,
    undefined,
    {
      state: { eq: EvolinciteStates.ACTIVE },
    }
  )
};

export const compareDate = (a: Date, b: Date) => {
  if (a < b) {
    return false;
  }
  return true;
};

export const ControlCrmState = {
  run,
};
