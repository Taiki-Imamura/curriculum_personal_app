class Api::V1::PaymentsController < ApplicationController
  def create
    ActiveRecord::Base.transaction do
      payment = Payment.create!(
        group_uuid: params[:payment][:group_uuid],
        title: params[:payment][:content],
        amount: params[:payment][:total_amount],
        paid_at: params[:payment][:paid_at],
      )

      payment_participants = params[:payment][:payment_participants].map do |participant|
        PaymentParticipant.create!(
          payment_id: payment.id,
          user_id: participant[:user_id],
          is_payer: participant[:is_payer],
          share_amount: participant[:share_amount],
          share_rate: participant[:share_rate],
          paid_amount: participant[:paid_amount]
        )
      end

      group = payment.group
      users = group.users

      render json: {
        group_name: group.name,
        users: users.map { |u| { id: u.id, name: u.name } },
        payments: [
          {
            id: payment.id,
            title: payment.title,
            amount: payment.amount,
            paid_at: payment.paid_at,
            payer_names: payment.payment_participants.select(&:is_payer).map { |pp| pp.user.name },
            participants: payment.payment_participants.map do |pp|
              {
                user_id: pp.user_id,
                user_name: pp.user.name,
                share_amount: pp.share_amount,
                share_rate: pp.share_rate,
                paid_amount: pp.paid_amount,
                is_payer: pp.is_payer
              }
            end
          }
        ]
      }
    end
  end
end