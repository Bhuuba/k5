import React from "react";

const Chat = () => {
  return (
    <div className="container text-center">
      <h1 className="fw-500 mb-3">Connect with Our Smart Chat Bots</h1>
      <p className="text-muted mx-auto mb-5" style={{ maxWidth: "600px" }}>
        Stay organized with AI-powered message summarization across all your
        favorite messaging platforms
      </p>
      <div className="row justify-content-center g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm rounded-4">
            <div className="card-body text-start">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-discord fs-3 me-2"></i>
                <h5 className="card-title mb-0">Discord Bot</h5>
              </div>
              <p className="text-muted small">
                Never miss important messages. Get smart summaries of unread
                conversations in your Discord servers.
              </p>
              <ul className="list-unstyled small mb-4">
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  Channel summaries
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  Direct message digests
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  Custom summarization rules
                </li>
              </ul>
              <a
                href="https://discord.com/"
                className="btn btn-dark w-100 rounded-3"
              >
                Add to Discord
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm rounded-4">
            <div className="card-body text-start">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-slack fs-3 me-2"></i>
                <h5 className="card-title mb-0">Slack Bot</h5>
              </div>
              <p className="text-muted small">
                Keep track of conversations across multiple channels with smart
                AI-powered <br /> summaries.
              </p>
              <ul className="list-unstyled small mb-4">
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  Workspace digests
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  Thread summaries
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  Integration with reminders
                </li>
              </ul>
              <a
                href="https://discord.com/"
                className="btn btn-dark w-100 rounded-3"
              >
                Add to Slack
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm rounded-4">
            <div className="card-body text-start">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-telegram fs-3 me-2"></i>
                <h5 className="card-title mb-0">Telegram Bot</h5>
              </div>
              <p className="text-muted small">
                Get instant summaries of group chats and channels with our
                intelligent Telegram bot.
              </p>
              <ul className="list-unstyled small mb-4">
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  Group chat summaries
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  Channel digest
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  Scheduled updates
                </li>
              </ul>
              <a
                href="https://discord.com/"
                className="btn btn-dark w-100 rounded-3"
              >
                Add to Telegram
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="py-5">
        <h2 className="fw-semibold mb-4">Why Choose Our Bots?</h2>
        <div className="row justify-content-center g-4">
          <div className="col-6 col-md-3">
            <div className="text-center">
              <i className="bi bi-lightning-fill fs-2 mb-2"></i>
              <h6 className="fw-bold">Fast Processing</h6>
              <p className="text-muted small">
                Get summaries within seconds of requesting them
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-center">
              <i className="bi bi-robot fs-2 mb-2"></i>
              <h6 className="fw-bold">Smart AI</h6>
              <p className="text-muted small">
                Advanced algorithms for accurate summarization
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-center">
              <i className="bi bi-shield-lock fs-2 mb-2"></i>
              <h6 className="fw-bold">Secure</h6>
              <p className="text-muted small">
                Your data is always encrypted and protected
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-center">
              <i className="bi bi-gear fs-2 mb-2"></i>
              <h6 className="fw-bold">Customizable</h6>
              <p className="text-muted small">
                Adjust settings to match your needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
