# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_28_074221) do
  create_table "group_users", force: :cascade do |t|
    t.integer "group_id", null: false
    t.integer "user_id", null: false
    t.datetime "joined_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id"], name: "index_group_users_on_group_id"
    t.index ["user_id"], name: "index_group_users_on_user_id"
  end

  create_table "groups", force: :cascade do |t|
    t.string "name"
    t.string "uuid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "payment_participants", force: :cascade do |t|
    t.integer "payment_id", null: false
    t.integer "user_id", null: false
    t.integer "share_amount"
    t.integer "share_rate"
    t.integer "paid_amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_payer", default: false, null: false
    t.index ["payment_id"], name: "index_payment_participants_on_payment_id"
    t.index ["user_id"], name: "index_payment_participants_on_user_id"
  end

  create_table "payment_paypay_links", force: :cascade do |t|
    t.integer "payment_id", null: false
    t.string "paypay_link"
    t.boolean "display_on_list"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["payment_id"], name: "index_payment_paypay_links_on_payment_id"
  end

  create_table "payments", force: :cascade do |t|
    t.string "title"
    t.integer "amount"
    t.datetime "paid_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "group_uuid"
    t.index ["group_uuid"], name: "index_payments_on_group_uuid"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "group_users", "groups"
  add_foreign_key "group_users", "users"
  add_foreign_key "payment_participants", "payments"
  add_foreign_key "payment_participants", "users"
  add_foreign_key "payment_paypay_links", "payments"
end
