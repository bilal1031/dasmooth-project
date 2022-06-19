import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Modal, Input } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileAddOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

import { colors } from "../utilities/colors";
import {
  BudgetForm,
  DateTimeSelection,
  Selectable,
  ImageUpload,
  MemberSelection,
  PostUpdateForm,
  TealButton,
  Loading,
} from "../components";

import { useUser } from "../hooks/useContext";
import { useNavigate, useParams } from "react-router";
import { handleAddBaton } from "../services";
import { generateNotification } from "../utilities/generateNotification";
export default function BatonsForm() {
  const { batonsData, setBatonsData, teamMembers,isLogin } = useUser();
  const params = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [activeTitle, setActiveTitle] = useState("");
  const [activeComponent, setActiveComponent] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const [teamMemberData, setTeamMemberData] = useState({
    text: "Select a team member",
    icon: <UserOutlined />,
    image: null,
  });
  const [dateData, setDateData] = useState("Set a deadline");
  const [budgetData, setBudgetData] = useState("Set a budget");
  const [postUpdateData, setPostUpdateData] = useState("");
  const [title, setTitle] = useState("");
  const [filesList, setFilesList] = useState({
    text: "Attach a file",
    filesList: [],
  });
  const [filesListB64,setFilesListB64] = useState([])
  const [id, setID] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [loading,setLoading] = useState(false)

  const flushData = () => {
    setActiveComponent(null);
    setActiveItemIndex(-1);
    setID(null);
    setTitle("");
    setActiveTitle("");
    setTeamMemberData({
      text: "Select a team member",
      icon: <UserOutlined />,
      image: null,
    });
    setDateData("Set a deadline");
    setBudgetData("Set a budget");
    setPostUpdateData("");
    setFilesList({
      text: "Attach a file",
      filesList: [],
    });
    setFilesListB64([])
  };

  const handlePass = () => {
    // console.log(
    //   dateData,
    //   budgetData,
    //   postUpdateData,
    //   filesList.filesList,
    //   title
    // );
   
    if (params.id == null) {
      console.log("New");
      
      let post ={
        deadline:dateData,
        budget:budgetData,
        post: postUpdateData,
        images:filesListB64,
        title,
        authorId: isLogin.uid,
        memberId:teamMemberData.id,
        memberName:teamMemberData.text,
        status: "pending",
        created: Date.now()
      };
      setLoading(true)
      console.log(post);
      handleAddBaton(post).then(()=>{
        generateNotification("success","Baton Added","You baton is created")
        setLoading(false)
        navigate("/main")
      }).catch((ex)=>{
        generateNotification("error","Error","Failed to create you baton")
        setLoading(false)
      }
      )
    } else {
      console.log("Edit");
      // temp = temp.map((e) => {
      //   if (e.id == params.id)
      //     return {
      //       ...e,
      //       dateData,
      //       budgetData,
      //       postUpdateData,
      //       filesList,
      //       title,
      //     };
      // });

      // console.log(temp);
      // setBatonsData(temp);
    }
    // navigate("/main");
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormItemRender = (title, component, index) => {
    setActiveComponent(component);
    setActiveItemIndex(index);
    setActiveTitle(title);
    if (window.innerWidth < 1024) {
      showModal();
    }
  };

  useEffect(() => {
    console.log(params);
    if (params.id) {
      let filter = batonsData.filter((e) => e.id == params.id);
      filter = filter[0];
      setTitle(filter.title);
      setBudgetData(filter.budgetData);
      setFilesList(filter.filesList);
      // ! here must deal b64 issue
      setDateData(filter.dateData);
      setPostUpdateData(filter.postUpdateData);
      setID(params.id);
      // console.log("filter", filter);
      batonsData.forEach((e) => console.log(e.title, "|", e.id));
    } else {
      flushData();
    }
  }, [params]);

  // This is to hide the form on fill
  const resetFormView = () => {
    setActiveTitle("");
    setActiveComponent(null);
  };
  useEffect(() => {
    resetFormView();
    if (
      dateData != "Set a deadline" &&
      budgetData != "Set a budget" &&
      postUpdateData != "" &&
      teamMemberData != "Select a team member" &&
      filesList.filesList.length != 0 &&
      title != ""
    )
      setDisabled(false);
    else setDisabled(true);
  }, [dateData, budgetData, postUpdateData, title, teamMemberData]);
  return (
    <Container className="d-flex flex-row mt-4 mx-0 justify-content-start align-items-start justify-content-lg-start">
      <Container fluid className="col">
        <Container className="col">
          <Modal
            title={activeTitle}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            mask={false}
          >
            {activeComponent}
          </Modal>

          <ArrowLeftOutlined
            style={{ fontSize: 20 }}
            onClick={() => {
              navigate("/main");
            }}
          />

          <h4 className="mt-4">{title == "" ? "Add Title" : title}</h4>
          {/* FormItems */}
          <div className="col-12">
            <Input
              size="large"
              placeholder="Add Text"
              className="me-3"
              onChange={(e) => setTitle(e.currentTarget.value)}
              value={title}
            />
          </div>
          <Container>
            <Selectable
              icon={teamMemberData.icon}
              image={teamMemberData.image}
              text={teamMemberData.text}
              onItemPress={() =>
                handleFormItemRender(
                  "Select a member",
                  <MemberSelection
                    itemSelected={teamMemberData}
                    setItemSelected={setTeamMemberData}
                    clickOk={handleOk}
                  />,
                  1
                )
              }
              isItemActive={
                activeItemIndex == 1 ||
                teamMemberData.text != "Select a team member"
                  ? true
                  : false
              }
            />
            <Selectable
              icon={<CalendarOutlined />}
              text={dateData}
              isItemActive={
                activeItemIndex == 2 || dateData != "Set a deadline"
                  ? true
                  : false
              }
              onItemPress={() =>
                handleFormItemRender(
                  "Set a deadline",
                  <DateTimeSelection
                    itemSelected={dateData}
                    setItemSelected={setDateData}
                    clickOk={handleOk}
                  />,
                  2
                )
              }
            />
            <Selectable
              icon={<DollarOutlined />}
              text={budgetData}
              isItemActive={
                activeItemIndex == 3 || budgetData != "Set a budget"
                  ? true
                  : false
              }
              onItemPress={() =>
                handleFormItemRender(
                  "Set a budget",
                  <BudgetForm
                    itemSelected={budgetData}
                    setItemSelected={setBudgetData}
                    clickOk={handleOk}
                  />,
                  3
                )
              }
            />
            <Selectable
              icon={<FileAddOutlined />}
              text={filesList.text}
              isItemActive={
                activeItemIndex == 4 || filesList.text != "Attach a file"
                  ? true
                  : false
              }
              onItemPress={() =>
                handleFormItemRender(
                  "Attach a file",
                  <ImageUpload
                    boxColor={colors.teal100}
                    itemSelected={filesList}
                    setItemSelected={setFilesList}
                    setFilesListB64 = {setFilesListB64}
                    clickOk={() => {
                      handleOk();
                      resetFormView();
                    }}
                  />,
                  4
                )
              }
            />
            <Selectable
              icon={<FileTextOutlined />}
              text="Post an Update"
              isItemActive={
                activeItemIndex == 5 || postUpdateData != "" ? true : false
              }
              onItemPress={() =>
                handleFormItemRender(
                  "Post an Update",
                  <PostUpdateForm
                    itemSelected={postUpdateData}
                    setItemSelected={setPostUpdateData}
                    clickOk={handleOk}
                  />,
                  5
                )
              }
            />
          </Container>
          {loading ? <Loading size="large"/>
:
          <TealButton
          className="col-12"
          onClick={handlePass}
          disabled={disabled}
          >
            PASS
          </TealButton>
          }
        </Container>
      </Container>

      {/*  */}
      <Container
        className="col flex-column d-none d-lg-flex"
        style={{ borderLeft: "1px solid grey" }}
      >
        <>
          <h4>{activeTitle}</h4>
          {activeComponent}
        </>
      </Container>
    </Container>
  );
}
