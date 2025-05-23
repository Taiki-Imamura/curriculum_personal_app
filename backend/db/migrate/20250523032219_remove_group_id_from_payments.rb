class RemoveGroupIdFromPayments < ActiveRecord::Migration[8.0]
  def change
    remove_column :payments, :group_id, :integer
  end
end
