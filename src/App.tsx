import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import getCurrentWeekNumber from './utilities/getWeekNumber';
import Column from './components/column/Column';
import { InterfaceColumns, InterfaceTeamData, Team } from './types/data';

const commentTypes = ['good', 'bad', 'actions'];

const emptyTeamData = {
    good: [''],
    bad: [''],
    actions: ['']
};

const weekNumber = getCurrentWeekNumber(new Date());

const App: React.FunctionComponent = () => {
    // todo: Include a landing page so the team can be chosen (if Black/Yellow will use this?)
    const [ team, updateTeam ] = useState<Team>('red');
    const [ teamData, updateTeamData ] = useState<InterfaceColumns>(emptyTeamData);

    // This is resonsible for updating the component state once when the component is mounted.
    // The empty array as a second argument means never update (no dependencies)
    useEffect(() => {
        const url = `/teams/${team}/week${weekNumber}.json`;

        Axios.post(url)
            .then((response: InterfaceTeamData) => {
                updateTeamData(response.data);
            })
            .catch((error) => {
                console.log(error);
                updateTeamData(emptyTeamData);
            });
    }, [team]);

    return (
        <>
            {!teamData ? <h2>Loading...</h2> : (
                <>
                    {commentTypes.map(commentType => {
                        return <Column key={commentType} comments={teamData[commentType]} updateTeamData={updateTeamData} commentType={commentType} />
                    })}
                </>
            )}
        </>
    );
};

export default App;
