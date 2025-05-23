class User < ApplicationRecord
  has_many :group_users
  has_many :groups, through: :group_users

  has_many :payment_participants
end