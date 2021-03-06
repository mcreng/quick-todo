import React, { Component } from 'react';
import logo from './logo.svg';
import { Layout, Input, Button, List, Icon, Row, Col } from "antd";
import firestore from "./firestore";
import './App.css';

const { Header, Footer, Content } = Layout;
const sort_by_date = (a, b) => { return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() };

class App extends Component {
  constructor(props) {
    super(props);
    // Set the default state of our application
    this.state = { addingTodo: false, 
                   pendingTodo: "", 
                   todos: [], 
                   done_todos: [], 
                   loading: true };

    // We want event handlers to share this context
    this.addTodo = this.addTodo.bind(this);
    this.completeTodo = this.completeTodo.bind(this);
    this.undoTodo = this.undoTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);

    firestore.collection("todos").onSnapshot(snapshot => {
      let todos = [], done_todos = [];
      snapshot.forEach(doc => {
        const todo = doc.data();
        todo.id = doc.id;
        if (!todo.completed) todos.push(todo); else done_todos.push(todo);
      });

      // Sort our todos based on time added
      todos.sort(sort_by_date);
      done_todos.sort(sort_by_date);

      // Anytime the state of our database changes, we update state
      this.setState({ todos, done_todos, loading: false });
    });
  }

  async addTodo(evt) {
    // Set a flag to indicate loading
    this.setState({ addingTodo: true, loading: true });
    // Add a new todo from the value of the input
    if (this.state.pendingTodo) {
      await firestore.collection("todos").add({
        content: this.state.pendingTodo,
        completed: false,
        createdAt: Date.now()
      });
    }
    // Remove the loading flag and clear the input
    this.setState({ addingTodo: false, pendingTodo: "", loading: false });
  }

  async completeTodo(id) {
    // Set a flag to indicate loading
    this.setState({ loading: true });
    // Mark the todo as completed
    await firestore
      .collection("todos")
      .doc(id)
      .update({
        completed: true
      });
      this.setState({ loading: false });
  }

  async undoTodo(id) {
    this.setState({ loading: true });
    // Remove the todo from completed
    await firestore
      .collection("todos")
      .doc(id)
      .update({
        completed: false
      });
    this.setState({ loading: false });
  }

  async deleteTodo(id) {
    this.setState({ loading: true });
    // Remove the todo
    await firestore
    .collection("todos")
    .doc(id)
    .delete();
    this.setState({ loading: false });
  }

  componentDidMount() {
    document.title = "Quick Todo"
  }

  render() {
    return (
      <Layout className="App">
        <Header className="App-header">
          <p>Quick Todo</p>
        </Header>
        <Content className="App-content">
        <div align="middle">
          <Row type="flex" justify="space-between" className="App-add-todo-span">
            <Col span={17} offset={2} >
              <Input
              ref="add-todo-input"
              className="App-add-todo-input"
              size="large"
              placeholder="What needs to be done?"
              disabled={this.state.addingTodo}
              onChange={evt => this.setState({ pendingTodo: evt.target.value })}
              value={this.state.pendingTodo}
              onPressEnter={this.addTodo}
              />
            </Col>
            <Col align="right" span={3}>
              <Button
                className="App-add-todo-button"
                size="large"
                type="primary"
                onClick={this.addTodo}
                loading={this.state.addingTodo}
              >Add Todo</Button>
            </Col>
            <Col offset={2}/>
          </Row>
        </div>
          <Row>
            <Col lg={{span: 9, offset: 2}}>
              <p className="list-title">Tasks in progress</p>
              <List
                className="App-todos"
                size="large"
                bordered
                dataSource={this.state.todos}
                loading={this.state.loading}
                renderItem={todo => (
                  <List.Item>
                    {todo.content}
                    <Icon
                      onClick={evt => this.completeTodo(todo.id)}
                      className="App-todo-complete"
                      type="check"
                    />
                    <Icon
                      onClick={evt => this.deleteTodo(todo.id)}
                      className="App-todo-delete"
                      type="delete"
                    />
                  </List.Item>)}
              />
            </Col>
            <Col lg={{span: 9, offset: 2}}>
              <p className="list-title">Tasks finished</p>
              <List
                className="App-done-todos"
                size="large"
                bordered
                dataSource={this.state.done_todos}
                loading={this.state.loading}
                renderItem={todo => (
                  <List.Item>
                    {todo.content}
                    <Icon
                      onClick={evt => this.undoTodo(todo.id)}
                      className="App-todo-uncomplete"
                      type="cross"
                    />
                    <Icon
                      onClick={evt => this.deleteTodo(todo.id)}
                      className="App-todo-delete"
                      type="delete"
                    />
                  </List.Item>)}
              />
            </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }} className="App-footer">
          Using Nodejs, React and AntDesign. Tutorial originated from <a href="https://dev.to/nbrempel/using-react-firebase-and-ant-design-to-quickly-prototype-web-applications-3hpa?utm_source=digest_mailer&utm_medium=email&utm_campaign=digest_email">here</a>.
        </Footer>
      </Layout>
    );
  }
}

export default App;
