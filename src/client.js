import axios from "axios";

// Client for the example terminal backend: https://github.com/stripe/example-terminal-backend
class Client {
  constructor(url) {
    this.url = "http://localhost:3000/dev";
    this.listLocations = this.listLocations.bind(this);
  }

  async createConnectionToken() {
    return await axios.post(
      this.url +
        "/terminal/create-connection-token/ff34a59a-6c1d-4445-9f76-e79d61305a1c"
    );
  }

  registerDevice({ label, registrationCode, location }) {
    const formData = new URLSearchParams();
    formData.append("label", label);
    formData.append("registration_code", registrationCode);
    formData.append("location", location);
    return this.doPost(this.url + "/register_reader", formData);
  }

  async createPaymentIntent({ amount }) {
    return await axios.post(
      this.url +
        `/terminal/create_payment_intent/ff34a59a-6c1d-4445-9f76-e79d61305a1c/${amount}`
    );
  }

  async capturePaymentIntent({ paymentIntentId }) {
    return await axios.post(
      this.url +
        `/terminal/capture_payment_intent/ff34a59a-6c1d-4445-9f76-e79d61305a1c/${paymentIntentId}`
    );
  }

  savePaymentMethodToCustomer({ paymentMethodId }) {
    const formData = new URLSearchParams();
    formData.append("payment_method_id", paymentMethodId);
    return this.doPost(
      this.url + "/attach_payment_method_to_customer",
      formData
    );
  }

  async listLocations() {
    const response = await fetch(this.url + "/list_locations", {
      method: "get",
    });

    if (response.ok) {
      return response.json();
    } else {
      let text = await response.text();
      throw new Error("Request Failed: " + text);
    }
  }

  async doPost(url, body) {
    let response = await fetch(url, {
      method: "post",
      body: body,
    });

    if (response.ok) {
      return response.json();
    } else {
      let text = await response.text();
      throw new Error("Request Failed: " + text);
    }
  }
}

export default Client;
