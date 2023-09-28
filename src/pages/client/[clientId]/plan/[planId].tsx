import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import Head from "next/head";
import { ActivityDisplay } from "components/activity-display";
import { Heading } from "components/ui/heading";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Activity, Plan } from "types/client";
import { ActivityUpdateModal } from "components/activity-update-modal";
import { ActivityStatus, PlanStatus } from "types/status";
import { PlanUpdateModal } from "components/plan-update-modal";
import { Button } from "components/ui/button";
import { StatusPill } from "components/status-pill";

const ClientPlanPage: NextPage<{ clientId: string; planId: string }> = ({
  clientId,
  planId,
}) => {
  const ctx = api.useContext();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [activityModalControl, setActivityModalControl] =
    useState<Activity | null>(null);
  const { data } = api.clients.getClientPlan.useQuery({ clientId, planId });
  const { mutate: updateActivity, isLoading } =
    api.clients.updateClientActivity.useMutation({
      onSuccess: () => {
        void ctx.clients.getClientPlan.invalidate();
        setActivityModalControl(null);
      },
      onError: () => {
        setActivityModalControl(null);
      },
    });
  const { mutate: updatePlan, isLoading: planLoading } =
    api.clients.updateClientPlan.useMutation({
      onSuccess: () => {
        void ctx.clients.getClientPlan.invalidate();
        setShowPlanModal(false);
      },
      onError: () => {
        setShowPlanModal(false);
      },
    });
  useEffect(() => {
    if (data?.plan) {
      setPlan(data.plan);
    }
  }, [data]);
  if (!plan) return <div>No Plan Found</div>;

  const openActivityModal = (id: string) => {
    const selectedActivity = plan.activityList.find(
      (activity) => activity.id === id,
    );
    if (selectedActivity) setActivityModalControl(selectedActivity);
  };

  const closeActivityModal = (note: string, complete: boolean) => {
    if (activityModalControl) {
      updateActivity({
        clientId,
        activityId: activityModalControl?.id,
        note: note,
        status: complete
          ? ActivityStatus.COMPLETE
          : activityModalControl.status,
      });
    }
  };

  const closePlanModal = (complete: boolean) => {
    updatePlan({
      clientId,
      planId,
      note: plan.note ?? "",
      status: complete ? PlanStatus.COMPLETE : plan.status,
    });
  };
  return (
    <>
      <Head>
        <title>{plan.name}</title>
      </Head>
      <ActivityUpdateModal
        isOpen={!!activityModalControl}
        onClose={closeActivityModal}
        activity={activityModalControl}
        loading={isLoading}
      />
      <PlanUpdateModal
        isOpen={showPlanModal}
        plan={plan}
        onClose={() => closePlanModal(false)}
        onConfirm={() => closePlanModal(true)}
        updatePlanNote={(value) => setPlan({ ...plan, note: value })}
        loading={planLoading}
      />
      <Link href={`/client/${clientId}`}>
        <ArrowLeftIcon />
      </Link>
      <div className="flex justify-between">
        <Heading title={plan.name} description={plan.description} />
        <StatusPill status={plan.status}/>
      </div>
      <ActivityDisplay plan={plan} openActivityModal={openActivityModal} />
      <span className="font-semibold">Plan Notes</span>
              <span className="text-sm">{plan.note}</span>
      <Button
        className=" rounded bg-emerald-600 p-2 font-semibold hover:bg-emerald-900 hover:text-neutral-300"
        disabled={plan.status === PlanStatus.COMPLETE}
        onClick={() => setShowPlanModal(true)}
      >
        Complete Plan
      </Button>
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
