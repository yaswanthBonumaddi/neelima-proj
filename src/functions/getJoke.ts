import { GSContext, GSStatus } from '@godspeedsystems/core';

export default async function (ctx: GSContext) {
  try {
    const { data } = await ctx.datasources.axios.execute(ctx, {
      url: 'https://official-joke-api.appspot.com/random_joke',
      method: 'GET',
    });
    return new GSStatus(true, 200, 'Joke fetched successfully', data);
  } catch (error: any) {
    ctx.logger.error('Error fetching joke:', error);
    return new GSStatus(false, 500, 'Failed to fetch joke', error.message);
  }
}