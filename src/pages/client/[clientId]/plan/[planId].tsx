import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import Head from "next/head";
import { ActivityDisplay } from "../../../../components/activity-display";
import { Heading } from "~/components/ui/heading";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Textarea } from "~/components/ui/textarea";
import { useEffect, useState } from "react";
import { type Plan } from "types/client";

const ClientPlanPage: NextPage<{ clientId: string; planId: string }> = ({
  clientId,
  planId,
}) => {
  const [plan, setPlan] = useState<Plan | null>(null)
  const { data } = api.client.getClientPlan.useQuery({ clientId, planId });
  useEffect(() => {
    if(data?.plan) {
      setPlan(data.plan)
    }
  }, [data])
  if (!plan) return <div>No Plan Found</div>;
  const updateActivity = (id: string, value: string) => {
    const updatedActivityList = [...plan.activityList];
    const index = updatedActivityList.findIndex(
      (item) => item.id === id
    );
    if (index !== -1 && updatedActivityList[index]) {
      // why use a ! mark instead of a ?
      // https://stackoverflow.com/questions/58414515/typescript-3-7beta-optional-chaining-operator-using-problem
      updatedActivityList[index]!.note = value;

      setPlan({...plan, activityList: [...updatedActivityList]});
    }
  }
  
  return (
    <>
      <Head>
        <title>{plan.name}</title>
      </Head>
      <Link href={`/client/${clientId}`}><ArrowLeftIcon /></Link>
      <div className="flex justify-between">
      <Heading title={plan.name} description={plan.description} />
      <span>{plan.status}</span>
      </div>
      <ActivityDisplay plan={plan} onActivityUpdate={updateActivity}/>
      <Textarea 
        value={plan.note ?? ''}
      />
    </>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const clientId = context.params?.clientId;
  const planId = context.params?.planId;
  if (typeof clientId !== "string") throw new Error("no client id");
  if (typeof planId !== "string") throw new Error("no plan id");
  await ssg.client.getClientPlan.prefetch({ clientId, planId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      clientId,
      planId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
export default ClientPlanPage;
