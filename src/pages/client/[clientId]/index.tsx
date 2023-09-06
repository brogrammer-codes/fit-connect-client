import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import Head from "next/head";
import { PlanStatus } from "types/status";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";

const ClientPage: NextPage<{ clientId: string }> = ({ clientId }) => {
  const { data } = api.client.getClient.useQuery({ clientId });
  if (!data) return <div>No Client with that ID</div>;
  const { client } = data;
  const assignedPlans = data.client.planList.filter(
    (plan) => plan.status === PlanStatus.ASSIGNED,
  );
  const completedPlans = data.client.planList.filter(
    (plan) => plan.status === PlanStatus.COMPLETE,
  );
  return (
    <>
      <Head>
        <title>{client.name}</title>
      </Head>

      <span className="text-3xl font-semibold">Welcome {client.name}</span>
      <span className="text-xl">Achieve Your Fitness Goals, Your Way</span>
      <Card className="rounded border-none bg-lime-900">
        <CardHeader>
          <CardTitle>{`Upcoming plans (${assignedPlans.length})`}</CardTitle>
          <CardDescription>
            Your assigned plans, click on a plan to see more details and record
            your workout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2 p-2">
            {assignedPlans.map((plan) => (
              <Link
                key={plan.id}
                href={`/client/${clientId}/plan/${plan.id}`}
                className="m-x-1 flex justify-between rounded p-2 text-xl font-semibold hover:bg-green-700"
              >
                <span>{plan.name}</span>
                <span>Activities: {plan.activityList.length}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="rounded border-none bg-sky-900">
        <CardHeader>
          <CardTitle>{`Completed plans (${completedPlans.length})`}</CardTitle>
          <CardDescription>
            Workouts you have already finished, click on them to view more
            details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2 p-2">
            {completedPlans.map((plan) => (
              <Link
                key={plan.id}
                href={`/client/${clientId}/plan/${plan.id}`}
                className="m-x-1 rounded p-2 text-xl font-semibold hover:bg-green-700"
              >
                {plan.name}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const clientId = context.params?.clientId;
  if (typeof clientId !== "string") throw new Error("no client id");
  await ssg.client.getClient.prefetch({ clientId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      clientId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
export default ClientPage;
