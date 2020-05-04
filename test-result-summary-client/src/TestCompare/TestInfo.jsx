import React, { Component } from 'react';
import { Form, Row, Input, Icon } from 'antd';
const FormItem = Form.Item;


export default class TestInfo extends Component {
    render() {
        const { data: { type, url, testName }, onChange } = this.props;

        return <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row>
                <FormItem label={type + " Build URL"}>
                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Jenkin Build URL" value={url} onChange={onChange.bind( null, 'url' )} />
                </FormItem>
                <FormItem label={type + " Test Name (Optional)"}>
                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Test Name (Optional)" value={testName} onChange={onChange.bind( null, 'testName' )} />
                </FormItem>
            </Row>
        </Form>
    }
}