import { createContext, useEffect, useState } from "react";
import { getStoryblokStory } from "../external/tests";

export type TestPanelData = {category: string, tests: {name: string, unit: string, id: string}[]}
type TestPanelDataBlock = {name: string, tests: {label: string, unit: string}[]}

const DATA: {story: TestPanelData[] | null, loading: boolean, error: string | null} = {story: null, loading: true, error: null};
export const StoryBlokContext = createContext<typeof DATA>(DATA);

export const setStoryBlokStory = (story: TestPanelData[]) => {
    DATA.story = story;
    DATA.loading = false;
    DATA.error = null;
}

export const TestPanelDataProvider = ({children}: {children: React.ReactNode}) => {
    const [data, setData] = useState<typeof DATA>(DATA);
    useEffect(() => {
        if (data.story) return;
        getStoryblokStory("home").then((story) => {
            const body = (story.content.body as TestPanelDataBlock[]).map((block) => {
                return {
                    category: block.name,
                    tests: block.tests.map((test) => {
                        return {
                            name: test.label,
                            unit: test.unit??"N/A",
                            id: `${block.name}-${test.label}`,
                        }
                    })
                }
            });
            setData({...data, story: body, loading: false, error: null});
            setStoryBlokStory(body);
        }).catch((error) => {
            setData({...data, story: null, loading: false, error: error.message || "Unknown error"});
        });
    }, []);
    return <StoryBlokContext.Provider value={data}>{children}</StoryBlokContext.Provider>
}