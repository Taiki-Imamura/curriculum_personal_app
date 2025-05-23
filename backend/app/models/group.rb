class Group < ApplicationRecord
  has_many :group_users
  has_many :users, through: :group_users

  has_many :payments, primary_key: 'uuid', foreign_key: 'group_uuid'
end