import React from "react";
import { useTranslation } from "react-i18next";

const Chat = () => {
  const { t } = useTranslation();

  return (
    <div className="container text-center">
      <h1 className="fw-500 mb-3">{t("Connect with Our Smart Chat Bots")}</h1>
      <p className="text-muted mx-auto mb-5" style={{ maxWidth: "600px" }}>
        {t(
          "Stay organized with AI-powered message summarization across all your favorite messaging platforms"
        )}
      </p>
      <div className="row justify-content-center g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm rounded-4">
            <div className="card-body text-start">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-discord fs-3 me-2"></i>
                <h5 className="card-title mb-0">{t("Discord Bot")}</h5>
              </div>
              <p className="text-muted small">
                {t(
                  "Never miss important messages. Get smart summaries of unread conversations in your Discord servers."
                )}
              </p>
              <ul className="list-unstyled small mb-4">
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  {t("Channel summaries")}
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  {t("Direct message digests")}
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  {t("Custom summarization rules")}
                </li>
              </ul>
              <a
                href="https://discord.com/oauth2/authorize?client_id=1310542652701409290"
                className="btn btn-dark w-100 rounded-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Add to Discord")}
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm rounded-4">
            <div className="card-body text-start">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-slack fs-3 me-2"></i>
                <h5 className="card-title mb-0">{t("Slack Bot")}</h5>
              </div>
              <p className="text-muted small">
                {t(
                  "Enhance your workspace productivity with our Slack integration."
                )}
              </p>
              <ul className="list-unstyled small mb-4">
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  {t("Channel highlights")}
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  {t("Thread summaries")}
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  {t("Custom integrations")}
                </li>
              </ul>
              <a
                href="https://app.slack.com/client/T081EFGHR38/D08P2RUMVDJ"
                className="btn btn-dark w-100 rounded-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Add to Slack")}
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm rounded-4">
            <div className="card-body text-start">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-telegram fs-3 me-2"></i>
                <h5 className="card-title mb-0">{t("Telegram Bot")}</h5>
              </div>
              <p className="text-muted small">
                {t(
                  "Get instant summaries of group chats and channels with our intelligent Telegram bot."
                )}
              </p>
              <ul className="list-unstyled small mb-4">
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  {t("Group chat summaries")}
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  {t("Channel digest")}
                </li>
                <li>
                  <i
                    style={{ marginRight: "10px" }}
                    className="bi bi-check2"
                  ></i>
                  {t("Scheduled updates")}
                </li>
              </ul>
              <a
                href="https://t.me/briefly_summary_bot"
                className="btn btn-dark w-100 rounded-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Add to Telegram")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="py-5">
        <h2 className="fw-semibold mb-4">{t("Why Choose Our Bots?")}</h2>
        <div className="row justify-content-center g-4">
          <div className="col-6 col-md-3">
            <div className="text-center">
              <i className="bi bi-lightning-fill fs-2 mb-2"></i>
              <h6 className="fw-bold">{t("Fast Processing")}</h6>
              <p className="text-muted small">
                {t("Get summaries within seconds of requesting them")}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-center">
              <i className="bi bi-robot fs-2 mb-2"></i>
              <h6 className="fw-bold">{t("Smart AI")}</h6>
              <p className="text-muted small">
                {t("Advanced algorithms for accurate summarization")}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-center">
              <i className="bi bi-shield-lock fs-2 mb-2"></i>
              <h6 className="fw-bold">{t("Secure")}</h6>
              <p className="text-muted small">
                {t("Your data is always encrypted and protected")}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-center">
              <i className="bi bi-gear fs-2 mb-2"></i>
              <h6 className="fw-bold">{t("Customizable")}</h6>
              <p className="text-muted small">
                {t("Adjust settings to match your needs")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
