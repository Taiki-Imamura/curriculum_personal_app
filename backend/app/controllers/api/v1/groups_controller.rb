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
end
