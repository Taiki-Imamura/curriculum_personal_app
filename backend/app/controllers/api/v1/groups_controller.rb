class Api::V1::GroupsController < ApplicationController
  def create
    ActiveRecord::Base.transaction do
      group = Group.create!(
        name: params[:group][:name],
        uuid: SecureRandom.uuid
      )

      user_ids = params[:members].map do |name|
        user = User.create!(name: name)
        GroupUser.create!(group: group, user: user)
        user.id
      end

      render json: { group_id: group.id, uuid: group.uuid }, status: :created
    end
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def show
    group = Group.find_by!(uuid: params[:id])
    
    payments = group.payments.includes(payment_participants: :user, payment_paypay_links: [])

    render json: {
      group_name: group.name,
      users: group.users.map { |u| { id: u.id, name: u.name } },
      payments: payments.map do |payment|
        {
          id: payment.id,
          title: payment.title,
          amount: payment.amount,
          paid_at: payment.paid_at,
          participants: payment.payment_participants.map do |pp|
            {
              user_id: pp.user_id,
              user_name: pp.user.name,
              is_payer: pp.is_payer,
              share_amount: pp.share_amount,
              share_rate: pp.share_rate,
              paid_amount: pp.paid_amount
            }
          end,
          paypay_links: payment.payment_paypay_links.map do |pl|
            {
              paypay_link: pl.paypay_link,
              display_on_list: pl.display_on_list
            }
          end
        }
      end
    }
  end

  def update
    group = Group.find_by!(uuid: params[:id])
    group.update!(name: params[:group][:name])
    group.group_users.destroy_all
    params[:members].each do |name|
      user = User.find_or_create_by!(name: name)
      GroupUser.create!(group: group, user: user)
    end
    render json: { group_id: group.id, uuid: group.uuid }, status: :ok
  end

  def destroy
    group = Group.find_by!(uuid: params[:id])
    group.destroy!
    render json: { message: 'グループを削除しました' }, status: :ok
  end
end
