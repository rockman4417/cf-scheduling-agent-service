import React from 'react';
import styled from "@emotion/styled";
import { getSalesReps } from './api';
import { useQuery } from '@tanstack/react-query';
import SalesRep from './SalesRep';
import { Skeleton, Typography } from '@mui/material';

type SalesRepProps = {
    onRecommendRep: (r: SalesRep) => void;
};

export default function SalesReps({onRecommendRep}: SalesRepProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["sales-reps"],
    queryFn: getSalesReps,
  });
  return (
    <Wrapper>
      <Typography>Sales Reps</Typography>
      <RepsWrapper>
        {isLoading
          ? Array(5).map((v, i) => <Skeleton key={i} />)
          : data?.map((r) => (
              <SalesRep onRecommendRep={onRecommendRep} key={r.name} rep={r} />
            ))}
      </RepsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
`;

const RepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #fff;
  border-radius: 4px;
`;

