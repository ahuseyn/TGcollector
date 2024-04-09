import { getActiveJob } from "helpers/getActiveJob";
import { onResumeJob } from "store/reducers/root";

export async function postRehydrate({ payload }, { dispatch }) {
  const { jobs } = payload;
  const activeJob = getActiveJob(jobs, false);

  if (activeJob) {
    dispatch(
      onResumeJob({
        id: activeJob.id,
        name: activeJob.name,
        params: activeJob.params,
        current: activeJob.current,
      })
    );
  }
}
