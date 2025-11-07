"use client";

import { useState } from "react";
import styled from "@emotion/styled";

const FormContainer = styled.div`
  padding: 1.5rem;
`;

const FormTitle = styled.h3`
  color: #333;
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #333;
  font-weight: 500;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background: #27ae60;
  color: white;

  &:hover:not(:disabled) {
    background: #229954;
  }
`;

const CancelButton = styled(Button)`
  background: #95a5a6;
  color: white;

  &:hover {
    background: #7f8c8d;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin: 0;
  font-size: 0.875rem;
`;

interface TeeTimeFormProps {
  courseId: string;
  courseUrl: string;
  onSubmit: (data: {
    start: string;
    end: string;
    date: string;
    deadline: string;
  }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  error?: string;
}

export default function TeeTimeForm({
  courseId,
  courseUrl,
  onSubmit,
  onCancel,
  loading,
  error,
}: TeeTimeFormProps) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [date, setDate] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ start, end, date, deadline });
  };

  return (
    <FormContainer>
      <FormTitle>Request Tee Time</FormTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="start">Tee Time Start</Label>
          <Input
            id="start"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="end">Tee Time End</Label>
          <Input
            id="end"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit Request"}
          </SubmitButton>
          <CancelButton type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}

