class RenameGroupIdToGroupUuidInPayments < ActiveRecord::Migration[7.1]
  def up
    add_column :payments, :group_uuid, :string

    # group_idからuuidを取得してgroup_uuidに代入
    execute <<-SQL.squish
      UPDATE payments
      SET group_uuid = (
        SELECT uuid FROM groups WHERE groups.id = payments.group_id
      )
    SQL

    # 必要に応じてindex追加
    add_index :payments, :group_uuid
  end

  def down
    remove_column :payments, :group_uuid
  end
end
