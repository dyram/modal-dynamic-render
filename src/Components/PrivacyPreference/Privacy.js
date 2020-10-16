import React, { useState } from "react";
import { Button, Modal, Typography, Steps, Radio, DatePicker } from "antd";
import * as AntIcons from "@ant-design/icons";
import moment from "moment";

//This data rendered from getAppConfig() in dashboard
import appConfig from "../../Config/dashboard.json";

export default function Privacy(props) {
  const [visible, setVisible] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [chosenValue, setChosenValue] = useState(undefined);
  const [chosenDate, setChosenDate] = useState(undefined);
  const [current, setCurrent] = useState(0);

  const { triggerDetails, modalDetails, stepperDetails } = appConfig.params;

  const { Text, Title } = Typography;
  const { Step } = Steps;

  const nextStep = () => {
    const NStep = current + 1;
    setCurrent(NStep);
  };

  const prevStep = () => {
    const PStep = current - 1;
    setCurrent(PStep);
  };

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setChosenValue(undefined);
    setChosenDate(undefined);
    setCurrent(0);
  };

  const selectValue = (event) => {
    console.log(event.target.value);
    setChosenValue(event.target.value);
  };

  const selectDate = (date, dateString) => {
    setChosenDate(date);
    console.log(date, dateString);
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };

  const getIcon = (iconType) => {
    const IconSelected = AntIcons[iconType];
    return <IconSelected />;
  };

  const { content, hasForm, formMeta } = stepperDetails.steps[current];

  return (
    <div>
      <Button
        type={triggerDetails.type}
        onClick={(e) => {
          openModal();
        }}
      >
        {getIcon(triggerDetails.triggerIcon)}
        {triggerDetails.triggerText}
      </Button>
      <Modal
        visible={visible}
        title={<Title level={5}>{modalDetails.modalTitle}</Title>}
        onCancel={closeModal}
        maskClosable={modalDetails.maskClosable}
        footer={[
          current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prevStep()}>
              Previous
            </Button>
          ),
          current < stepperDetails.steps.length - 1 && (
            <Button type="primary" onClick={() => nextStep()}>
              {stepperDetails.intermediaryText}
            </Button>
          ),
          current === stepperDetails.steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => {
                closeModal();
              }}
            >
              {stepperDetails.doneText}
            </Button>
          )
        ]}
      >
        <div style={{ textAlign: "center" }}>
          <Steps
            direction={stepperDetails.direction}
            current={current}
            progressDot={stepperDetails.progressDot}
          >
            {stepperDetails.steps.map((step) => (
              <Step
                title={<Title level={5}>{step.title}</Title>}
                key={step.title}
              />
            ))}
          </Steps>
          <Text>{content}</Text>
          {hasForm ? (
            formMeta.fields.options ? (
              <Radio.Group onChange={selectValue} value={chosenValue}>
                {formMeta.fields.options.map((options) => (
                  <Radio value={options.value}>{options.label}</Radio>
                ))}
              </Radio.Group>
            ) : (
              <DatePicker
                onChange={selectDate}
                placeholder="Select a date"
                disabledDate={disabledDate}
                format="DD/MM/YYYY"
              />
            )
          ) : (
            <></>
          )}
        </div>
      </Modal>
    </div>
  );
}
