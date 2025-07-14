import StoryBlokClient, {
    ISbStory,
    ISbStoryParams,
  } from "storyblok-js-client";
  
  type StoryblokStory = ISbStory & {content: {body: any[]}};
  
  
  export const storyblokClient = new StoryBlokClient({
    accessToken: import.meta.env.VITE_STORYBLOK_KEY || "",
    cache: {
      clear: "auto",
      type: "memory",
    },
  });
  
  export const getStoryblokStory = async (slug: string, params: ISbStoryParams = {}) => {
    const {data} = await storyblokClient.get(`cdn/stories/${slug}`, {
      version: "draft",
      ...params,
    });
    return data.story as StoryblokStory;
  };
  