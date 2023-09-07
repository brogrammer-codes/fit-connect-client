import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import Head from "next/head";
import { ActivityDisplay } from "components/activity-display";
import { Heading } from "components/ui/heading";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Textarea } from "components/ui/textarea";
import { useEffect, useState } from "react";
import type { Activity, Plan } from "types/client";
import { ActivityUpdateModal } from "components/activity-update-modal";
import { ActivityStatus } from "types/status";

const ClientPlanPage: NextPage<{ clientId: string; planId: string }> = ({
  clientId,
  planId,
}) => {
  const ctx = api.useContext();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [activityModalControl, setActivityModalControl] =
    useState<Activity | null>(null);
  const { data } = api.clients.getClientPlan.useQuery({ clientId, planId });
  const { mutate } = api.activity.updateActivity.useMutation({
    onSuccess: () => {
      void ctx.clients.getClientPlan.invalidate();
      setActivityModalControl(null);
    },
    onError: () => {
      setActivityModalControl(null);
    }
  });
  useEffect(() => {
    if (data?.plan) {
      setPlan(data.plan);
    }
  }, [data]);
  if (!plan) return <div>No Plan Found</div>;
  const updateActivityNote = (id: string, value: string) => {
    const updatedActivityList = [...plan.activityList];
    const index = updatedActivityList.findIndex((item) => item.id === id);
    if (index !== -1 && updatedActivityList[index]) {
      // why use a ! mark instead of a ?
      // https://stackoverflow.com/questions/58414515/typescript-3-7beta-optional-chaining-operator-using-problem
      updatedActivityList[index]!.note = value;

      setPlan({ ...plan, activityList: [...updatedActivityList] });
    }
  };
  const openActivityModal = (id: string) => {
    const selectedActivity = plan.activityList.find(
      (activity) => activity.id === id,
    );
    if (selectedActivity) setActivityModalControl(selectedActivity);
  };
  const closeActivityModal = (complete: boolean) => {
    if (activityModalControl) {
      mutate({
        clientId,
        activityId: activityModalControl?.id,
        note: activityModalControl.note ?? "",
        status: complete? ActivityStatus.COMPLETE : activityModalControl.status,
      });
    }
  };
  return (
    <>
      <Head>
        <title>{plan.name}</title>
      </Head>
      <ActivityUpdateModal
        isOpen={!!activityModalControl}
        onClose={() => closeActivityModal(false)}
        onConfirm={() => closeActivityModal(true)}
        updateActivityNote={updateActivityNote}
        activity={plan.activityList[0]}
      />
      <Link href={`/client/${clientId}`}>
        <ArrowLeftIcon />
      </Link>
      <div className="flex justify-between">
        <Heading title={plan.name} description={plan.description} />
        <span>{plan.status}</span>
      </div>
      <ActivityDisplay plan={plan} openActivityModal={openActivityModal} />
      <Textarea value={plan.note ?? ""} />
    </>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const clientId = context.params?.clientId;
  const planId = context.params?.planId;
  if (typeof clientId !== "string") throw new Error("no client id");
  if (typeof planId !== "string") throw new Error("no plan id");
  await ssg.clients.getClientPlan.prefetch({ clientId, planId });
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
