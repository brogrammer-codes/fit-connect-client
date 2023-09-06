import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import Head from "next/head";
import { ActivityDisplay } from "../../components/activity-display";
import { Heading } from "~/components/ui/heading";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Textarea } from "~/components/ui/textarea";

const ClientPlanPage: NextPage<{ clientId: string; planId: string }> = ({
  clientId,
  planId,
}) => {
  const { data } = api.client.getClientPlan.useQuery({ clientId, planId });
  if (!data) return <div>No Plan Found</div>;
  const { plan } = data;

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
      <ActivityDisplay plan={plan} />
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
